import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  name: "capstone",
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.prettyPrint(),
    format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    }),
  ),
  level: "debug",
});
