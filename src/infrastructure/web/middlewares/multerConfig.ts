import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "node:crypto";
import { Request } from "express";

// 1. Definir la carpeta temporal de almacenamiento
const tempDir = path.join(__dirname, "../../../..", "temp_uploads");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 2. Definir el motor de almacenamiento
const storage: StorageEngine = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ): void {
    cb(null, tempDir);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ): void {
    const uniqueSuffix = randomUUID();
    const extension = path.extname(file.originalname).toLocaleLowerCase();
    cb(null, uniqueSuffix + extension);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5mb por imagen
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG and WEBP are allowed"));
    } else {
      cb(null, true);
    }
  },
});
