export interface CreateUserDTO {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  isValidEmail: boolean;
  avatar: string;
  createAt: Date;
  updatedAt: Date;
}
