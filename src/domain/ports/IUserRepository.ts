import { User } from "../entities/User";

export interface IUserRepository {
  // Establece el contrato de la funcion que deberia guardar al usuario
  save(user: User): Promise<void>;
  // Establece el contrato de la funcion que deberia buscar un usuario por username
  findByUsername(username: string): Promise<User>;
}
