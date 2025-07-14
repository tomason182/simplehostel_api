import "dotenv/config.js";
import type { IUserService } from "../../../application/IUserService";
import { Request, Response, NextFunction } from "express";

export class UserController {
  public readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async authUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { username, password } = req.body;

      const result = await this.userService.authUser(username, password);

      // Pasamos timeNow como valor del Auth cookie para verificar cuando expira en el front.
      const expirationTimeMS = 3600 * 8 * 1000; // 8 hs en milisegundos
      const timeNow = Date.now().toString();

      return res
        .cookie("jwt", result.token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          signed: true,
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          domain:
            process.env.NODE_ENV === "production"
              ? ".simplehostel.net"
              : undefined,
          maxAge: expirationTimeMS,
        })
        .cookie("isAuth", timeNow, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
          maxAge: expirationTimeMS,
          domain:
            process.env.NODE_ENV === "production"
              ? ".simplehostel.net"
              : undefined,
        })
        .status(200)
        .json({
          username: result.user.getUsername() || "guest",
          firstname: result.user.getFirstName() || "guest",
        });
    } catch (err) {
      next(err);
    }
  }
}
