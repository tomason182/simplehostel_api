import { User } from "../domain/entities/User";
import { IPropertyRepository } from "../domain/ports/IPropertyRepository";
import { IUserRepository } from "../domain/ports/IUserRepository";
import { CreatePropertyDTO } from "../dto/PropertyDTO";
import { CreateUserDTO } from "../dto/UserDTO";
import { EmailServiceSMTP } from "../infrastructure/email/EmailServiceSMTP";

export class RegistrationService {
  constructor(
    private userRepository: IUserRepository,
    private propertyRepository: IPropertyRepository,
    private emailService: EmailServiceSMTP,
  ) {
    this.userRepository = userRepository;
    this.propertyRepository = propertyRepository;
    this.emailService = emailService;
  }

  async register(
    userDTO: CreateUserDTO,
    propertyDTO: CreatePropertyDTO,
  ): Promise<void> {
    // 1. Comprobarmos si el username existe.
    const userExist = await this.userRepository.findByUsername(
      userDTO.username,
    );

    if (userExist !== null) {
      throw new Error("USER_EXIST");
    }

    // 2. Creamos la entidad usuario
    const user = await User.fromCreateUserDTO(userDTO, { hashPassword: true });

    // 3. Guardar el usuario en la base de datos

    // 4. Crear la entidad Property
  }
}
