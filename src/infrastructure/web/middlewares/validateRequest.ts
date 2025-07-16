import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}
