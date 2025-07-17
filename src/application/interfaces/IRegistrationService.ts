import { CreatePropertyDTO } from "../../dto/PropertyDTO";
import { CreateUserDTO, UserDTO } from "../../dto/UserDTO";

export interface IRegistrationService {
  register(
    userDTO: CreateUserDTO,
    propertyDTO: CreatePropertyDTO,
  ): Promise<{ status: string; msg: string }>;
}
