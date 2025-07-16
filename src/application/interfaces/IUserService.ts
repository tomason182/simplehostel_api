import { UserDTO } from "../dto/UserDTO";
import { User } from "../domain/entities/User";

export interface IUserService {
  authUser(username: string, password: string): Promise<AuthResult>;
}

export interface AuthResult {
  user: User;
  token: string;
}
