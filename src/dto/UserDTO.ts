export interface CreateUserDTO {
  username: string;
  firstName: string;
  password: string;
  lastName?: string;
}

export interface UserDTO {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  isValidEmail: boolean;
  lastResendEmail: number;
  role: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}
