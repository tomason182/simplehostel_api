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
