import { UnitOfWork } from "./UnitOfWork";

type TransactionalMethod = (
  ...args: any[]
) => Promise<any> & { useTransaction?: boolean };

type TransactionalService = {
  [key: string]: TransactionalMethod | any;
};

// Proxy para transacciones
export function makeTransactional<T extends TransactionalService>(
  service: T,
  unitOfWork: UnitOfWork,
): T {
  return new Proxy(service, {
    get(target, propKey: string | symbol) {
      const originalMethod = (target as any)[propKey];
      if (typeof originalMethod !== "function") {
        return originalMethod;
      }

      const needTransaction = originalMethod.useTransaction === true;

      return async function (...args: any[]) {
        try {
          // 1. Adquirir la conexión
          await unitOfWork.getConnection();

          // 2. Iniciar transaccion si el metodo lo requiere.
          if (needTransaction === true) {
            await unitOfWork.begin();
            console.log(
              `[Transaction]: Transacción iniciada para el caso de uso: ${String(propKey)}`,
            );
          }

          // 3. Ejecutar el metodo original del servicio.
          // El servicio y el repositorio tienen la conexión
          const result = await originalMethod.apply(target, args);

          // 4. Hacer commit a la transacción (el metodo incluye release connection);
          if (needTransaction === true) {
            await unitOfWork.commit();
          }

          return result;
        } catch (err) {
          // 5. Hacer rollback si algo falla. (El metodo incluye release connection)
          if (needTransaction === true) {
            await unitOfWork.rollback();
          }
          throw err;
        } finally {
          // 6. Liberar el recurso simpre sin importar lo que paso
          await unitOfWork.release();
        }
      };
    },
  });
}
