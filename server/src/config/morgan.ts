import morgan from "morgan";
import logger from "./logger.js";

const stream = {
  write: (message: string): void=> {
    logger.info(message.trim());
  },
};

const morganMiddleware = morgan(
  ":method :url :status :response-time ms",
  { stream },
);

export default morganMiddleware;