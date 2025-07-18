import { User } from "../entities/User";

export interface IUserRepository {
  // Establece el contrato de la funcion que deberia guardar al usuario
  save(user: User): Promise<void>;
  // Establece el contrato de la funcion que deberia buscar un usuario por username
  findByUsername(username: string): Promise<User>;
  // Funcion que deberia buscar un usuario por id
  findById(id: string): Promise<User>;
  // Funcion que deberia actualizar el mail de usuario como valido
  validateEmail(id: number): Promise<void>;
}
