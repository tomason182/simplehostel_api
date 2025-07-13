import http, { Server } from "node:http";
import createDebug from "debug";
import app from "./app";
import { logger } from "./utils/logger";
import "dotenv/config";
import { initMysql, getMySQL } from "./config/mysql.instance";
const port = process.env.PORT;

if (!port) {
  logger.error("PORT is not defined in envierment variables");
  process.exit(1);
}

async function initServer(): Promise<void> {
  try {
    await initMysql();

    const server = http.createServer(app);
    const debug = createDebug("simple-hostel-api:server");

    server.listen(port, () => logger.info(`Server started on port ${port}`));
    server.on("error", onError);
    server.on("listening", () => onListening(server, debug));

    process.on("exit", () => onShutdown(server));
    process.on("SIGTERM", () => onShutdown(server));
    process.on("SIGINT", () => onShutdown(server));
    process.on("uncaughtException", onErrorShutdown);
  } catch (err) {
    logger.error("Error iniciando el servidor: ", err);
    process.exit(1);
  }
}

initServer();

// ------------------------------------------------------
// Funciones auxiliares
// ------------------------------------------------------

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // Handle specific listen error
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(server: Server, debug: debug.Debugger): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debug("Listening on " + bind);
}

async function onShutdown(server: Server): Promise<void> {
  logger.info("Shutting down the server...");

  try {
    // Disconnect the database
    await getMySQL().disconnect();
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Error al desconectar la base de datos: ", err.message);
    } else {
      logger.error("Error desconocido al desconectar base de datos: ", err);
    }
  }

  // Close the server
  server.close(() => {
    logger.info("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forcing shutdown");
    process.exit(1);
  }, 1000);
}

async function onErrorShutdown(error: NodeJS.ErrnoException): Promise<void> {
  logger.error("An unexpected error occurred: ", error);

  // Disconnect the database
  try {
    await getMySQL().disconnect();
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Error al desconectar la base de datos:", err.message);
    } else {
      logger.error("Error desconocido al desconectar la base de datos:", err);
    }
  }

  process.exit(1);
}
