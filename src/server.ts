import http from "node:http";
import createDebug from "debug";
import app from "./app";
import { logger } from "./utils/logger";
import "dotenv/config";
const port = process.env.PORT;

if (!port) {
  logger.error("PORT is not defined in envierment variables");
  process.exit(1);
}

const server = http.createServer(app);
const debug = createDebug("simple-hostel-api:server");

server.listen(port, () => logger.info(`Server started on port ${port}`));
server.on("error", onError);
server.on("listening", onListening);

process.on("exit", onShutdown);
process.on("SIGTERM", onShutdown);
process.on("SIGINT", onShutdown);
process.on("uncaughtException", onErrorShutdown);

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

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debug("Listening on " + bind);
}

async function onShutdown(): Promise<void> {
  logger.info("Shutting down the server...");

  try {
    // Disconnect the database
    mysql.disconnect();
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

function onErrorShutdown(error: NodeJS.ErrnoException): void {
  logger.error("An unexpected error occurred: ", error);

  // Disconnect the database
  try {
    mysql.disconnect();
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Error al desconectar la base de datos:", err.message);
    } else {
      logger.error("Error desconocido al desconectar la base de datos:", err);
    }
  }

  process.exit(1);
}
