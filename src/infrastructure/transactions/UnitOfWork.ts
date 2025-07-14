import { Pool, PoolConnection } from "mysql2/promise";

export class UnitOfWork {
  public readonly pool: Pool;
  public connection: PoolConnection | null;

  constructor(pool: Pool) {
    this.pool = pool;
    this.connection = null;
  }

  // 1. Responsabilidad: Asegurar tener conexión
  async getConnection(): Promise<PoolConnection> {
    if (!this.connection) {
      this.connection = await this.pool.getConnection();
    }

    return this.connection;
  }

  // 2. Responsabilidad: Inciar transaccion sobre conexión existente
  async begin(): Promise<void> {
    if (!this.connection) {
      throw new Error(
        "No se puede iniciar una transaccion sin conexion. Llame a getConnection() primero",
      );
    }
    await this.connection.beginTransaction();
  }

  // 3. Responsibilidad: Realizar commit a la transaccion
  async commit() {
    await this.connection?.commit();
  }

  // 4. Responsabilidad: Hacer rollback a la transaccion
  async rollback() {
    await this.connection?.rollback();
  }

  // 5. Responsabilidad: Liberar la conexión
  release() {
    if (this.connection) {
      this.connection.release();
      this.connection = null;
    }
  }
}
