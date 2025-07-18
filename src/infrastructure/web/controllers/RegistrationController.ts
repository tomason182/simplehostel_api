import { matchedData } from "express-validator";
import { verifyCaptcha } from "../middlewares/verifyCaptcha";
import { Request, Response, NextFunction } from "express";
import { IRegistrationService } from "../../../application/interfaces/IRegistrationService";
import { CreateUserDTO } from "../../../dto/UserDTO";
import { CreatePropertyDTO } from "../../../dto/PropertyDTO";
export class RegistrationController {
  constructor(private registrationService: IRegistrationService) {
    this.registrationService = registrationService;
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const {
        username,
        firstName,
        password,
        propertyName,
        acceptTerms,
        captchaToken,
      } = req.body;

      if (!acceptTerms) {
        return res.status(400).json({ msg: "ACCEPT_TERMS" });
      }

      const isValidCaptcha = await verifyCaptcha(captchaToken);

      if (!isValidCaptcha) {
        return res.status(400).json({ msg: "INVALID_CAPTCHA" });
      }

      const userDTO: CreateUserDTO = {
        username,
        firstName,
        password,
      };

      const propertyDTO: CreatePropertyDTO = {
        propertyName,
      };

      const result = await this.registrationService.register(
        userDTO,
        propertyDTO,
      );

      if (result.status && result.status === "error") {
        return res.status(400).json({
          status: "error",
          msg: result.msg || "UNKNOWN_ERROR",
        });
      }

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async validateEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const token = req.params.token;

      const result = await this.registrationService.validateEmail(token);

      if (result.status && result.status === "error") {
        return res.status(400).json({
          status: "error",
          msg: result.msg || "UNNKOWN_ERROR",
        });
      }

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async resendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.params.email;

      const result = await this.registrationService.resendEmail(email);

      if (result.status && result.status === "error") {
        return res.status(400).json({
          status: "error",
          msg: result.msg || "UNKNOWN_ERROR",
        });
      }

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
