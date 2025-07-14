//import "dotenv/config.js";
import { sign, verify } from "jsonwebtoken";

export function jwtTokenGenerator(
  data: object,
  expiresIn: string = "8h",
): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET enviroment variable in not defined");
  }

  const payload = {
    sub: data,
  };

  const token = sign(payload, jwtSecret, { expiresIn });
  return token;
}
