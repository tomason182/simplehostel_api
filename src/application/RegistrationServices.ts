import { User } from "../domain/entities/User";
import { Property } from "../domain/entities/Property";
import { AccessControl } from "../domain/entities/AccessControl";
import { IPropertyRepository } from "../domain/ports/IPropertyRepository";
import { IUserRepository } from "../domain/ports/IUserRepository";
import { CreatePropertyDTO } from "../dto/PropertyDTO";
import { CreateUserDTO } from "../dto/UserDTO";
import { EmailServiceSMTP } from "../infrastructure/email/EmailServiceSMTP";
import { IAccessControlRepository } from "../domain/ports/IAccessControlRepository";
import { jwtTokenGenerator } from "../utils/jwtTokenGenerator";
import { IRegistrationService } from "./interfaces/IRegistrationService";

export class RegistrationService implements IRegistrationService {
  constructor(
    private userRepository: IUserRepository,
    private propertyRepository: IPropertyRepository,
    private accessControl: IAccessControlRepository,
    private emailService: EmailServiceSMTP,
  ) {
    this.userRepository = userRepository;
    this.propertyRepository = propertyRepository;
    this.emailService = emailService;
  }

  async register(userDTO: CreateUserDTO, propertyDTO: CreatePropertyDTO) {
    // 1. Comprobarmos si el username existe.
    const userExist = await this.userRepository.findByUsername(
      userDTO.username,
    );

    if (userExist !== null) {
      throw new Error("USER_EXIST");
    }

    // 2. Creamos la entidad usuario
    const user = await User.fromCreateUserDTO(userDTO, { hashPassword: true });

    user.setLastResendEmail();

    // 3. Guardar el usuario en la base de datos
    await this.userRepository.save(user);

    // 4. Crear la entidad Property
    const property = Property.fromCreatePropertyDTO(propertyDTO);

    // 5. Guardamos la propiedad en la base de datos
    await this.propertyRepository.save(property);

    // 6. Creamos el access control
    // 6.1 Role admin en el registro
    const role = "admin";
    const accessControl = new AccessControl(
      null,
      user.getId(),
      property.getId(),
      role,
      null,
      null,
    );

    // 7. Guardamos el accessControl
    await this.accessControl.save(accessControl);

    // 8. Enviamos email de confirmación
    const tokenData = {
      id: user.getId(),
      email: user.getUsername(),
    };

    const token = jwtTokenGenerator(tokenData, 900); // el token expira en 900 segundos | 15min
    const confirmationLink =
      process.env.API_URL + "/accounts/email-validation/" + token;
    const to = user.getUsername();
    const subject = "Confirma tu correo electrónico";
    const templateName = "email_confirmation";
    const data = {
      logoUrl: process.env.LOGO_URL,
      appName: process.env.APP_NAME,
      websiteUrl: process.env.WEBSITE_URL,
      name: user.getFirstName(),
      confirmationLink: confirmationLink,
      year: new Date().getFullYear.toString(),
      companyName: process.env.COMPANY_NAME,
      supportEmail: process.env.SUPPORT_EMAIL,
    };

    await this.emailService.sendEmail(to, subject, templateName, data, "es");

    return {
      status: "ok",
      msg: "USER_REGISTRATION_SUCCESS",
    };
  }
}
