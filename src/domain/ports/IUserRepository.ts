import { User } from "../entities/User";

export interface IUserRepository {
  save(user: User): Promise<void>;

  findByUsername(username: string): Promise<User>;

  findById(id: string): Promise<User>;

  validateEmail(id: number): Promise<void>;

  updateLastResendEmail(user: User): Promise<void>;
}
