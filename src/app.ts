import express, { ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import { getMySQL } from "./config/mysql.instance";
import "dotenv/config";

export async function createApp() {
  const app = express();

  const pool = getMySQL().getPool();

  const container = new Container(pool);

  // Trust proxy from nginx
  app.set("trust proxy", 1);

  // Cors options
  const corsOptions = {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://www.simplehostel.net", "https://simplehostel.net"]
        : ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  };

  // Seguridad
  app.use(helmet());

  // Login
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  // Rate limit
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many request from this IP, please try again later",
  });

  app.use("/api/v1/", apiLimiter);

  // compresion
  app.use(compression());

  // Middelware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.JWT_SECRET));

  // Middlewara para pasar el contenedor
  app.use((req, res, next) => {
    res.locals.container = container;
    next();
  });

  // RUTAS

  // Handler para rutas no encontradas
  app.use((req, res) => {
    res.status(400).json({ error: "Endpoint not found" });
  });

  // Error handler
  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let errorMessage = "Unexpedted gobalerror occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    console.error(errorMessage);
    res.status(500).json({ error: errorMessage });
  };

  app.use(errorHandler);

  return app;
}
