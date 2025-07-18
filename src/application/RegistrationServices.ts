import { User } from "../domain/entities/User";
import { Property } from "../domain/entities/Property";
import { AccessControl } from "../domain/entities/AccessControl";
import { IPropertyRepository } from "../domain/ports/IPropertyRepository";
import { IUserRepository } from "../domain/ports/IUserRepository";
import { CreatePropertyDTO } from "../dto/PropertyDTO";
import { CreateUserDTO } from "../dto/UserDTO";
import { EmailServiceSMTP } from "../infrastructure/email/EmailServiceSMTP";
import { IAccessControlRepository } from "../domain/ports/IAccessControlRepository";
import {
  jwtTokenGenerator,
  jwtTokenValidation,
} from "../utils/jwtTokenGenerator";
import { IRegistrationService } from "./interfaces/IRegistrationService";
import { JwtPayload } from "jsonwebtoken";

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
      return {
        status: "error",
        msg: "USER_EXIST",
      };
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

    // 8. Enviamos email de confirmació
    await this.sendConfirmationEmail(user);

    return {
      status: "ok",
      msg: "USER_REGISTRATION_SUCCESS",
    };
  }

  async validateEmail(token: string) {
    // 1. Decodificar el token
    const decoded = jwtTokenValidation(token) as
      | (JwtPayload & { sub: { id: string; email: string } })
      | false;

    if (decoded === false || !decoded.sub) {
      return {
        status: "error",
        msg: "INVALID_OR_EXPIRED_TOKEN",
      };
    }

    // 2. Obtenemos el userId. Token sub = { id:id, email: email}
    const id = decoded.sub.id;

    // 3. Buscar el usuario por ID
    const user = await this.userRepository.findById(id);

    if (!user) return { status: "error", msg: "USER_NOT_FOUND" };

    // 4. Chequear si la cuenta ya fue validada.
    const isValidAccount = user.checkValidAccount();

    if (isValidAccount === true) {
      return { status: "error", msg: "ACCOUNT_ALREADY_VALIDATED" };
    }

    // 5. Establecemos el mail como valido. (NO TIENE SENTIDO PORQUE SE VALIDA EN EL SIGUIENTE PASO)
    //user.setValidEmail()

    // 6. Actualizamos solamente "isValidEmail" acà
    await this.userRepository.validateEmail(user.getId());

    // 7. Auto enviarme un email avisando que se registro un nuevo usuario
    const to = process.env.SUPPORT_EMAIL || "support@simplehostel.net";
    const subject = "Se registro un nuevo hostel";
    const templateName = "new_register";
    const data = {
      logoUrl: process.env.LOGO_URL || "",
      name: user.getFirstName() || "Sin nombre",
      email: user.getUsername() || "Sin nombre",
    };

    await this.emailService.sendEmail(to, subject, templateName, data);

    return {
      status: "ok",
      msg: "ACCOUNT_VALIDATED",
    };
  }

  async resendEmail(email: string): Promise<{ status: string; msg: string }> {
    // 1. Buscar usuario por email
    const user = await this.userRepository.findByUsername(email);

    if (user === null) {
      return {
        status: "error",
        msg: "USER_NOT_FOUND",
      };
    }

    // 2. Verificar que el usuario no este validado.
    const isValidAccount = user.checkValidAccount();
    if (isValidAccount === true) {
      return {
        status: "error",
        msg: "ACCOUNT_ALREADY_VALIDATED",
      };
    }

    // 3. Verificar tiempo de espera.
    const canResendEmail = user.canResendEmail();

    if (canResendEmail === false) {
      return {
        status: "error",
        msg: "WAITING_PERIOD",
      };
    }

    // 4. Actualizar last resend email
    user.setLastResendEmail();
    await this.userRepository.updateLastResendEmail(user);

    // 5. Reenviar mail de confiramcion
    await this.sendConfirmationEmail(user);

    return {
      status: "ok",
      msg: "EMAIL_RESEND",
    };
  }

  private async sendConfirmationEmail(user: User): Promise<void> {
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
  }
}

(RegistrationService.prototype.register as any).useTransaction = true;
