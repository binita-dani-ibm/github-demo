import winston from "winston";
import wConfig from "./wconfig";

winston.addColors(wConfig.colors);

const printFormat = winston.format.printf(
  ({ level, message, timestamp }) => {
    const date = new Date(timestamp as string | number | Date);    
    return `${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })} ${level.toLocaleUpperCase()}: ${message}`;
  }
);


const format = winston.format.combine(
  winston.format.timestamp(),  // Ensure timestamp is included in file logs as well
  printFormat
);

const wLogger = (input: { logName: string; level: string }): winston.Logger =>
  winston.createLogger({
    levels: wConfig.levels,
    level: `${input.level}`,
    transports: [
      new winston.transports.Console({
        level: `${input.level}`,
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.errors({ stack: true }),
          winston.format.timestamp(),
          printFormat,
          winston.format.colorize({ all: true })
        ),
      }),
      new winston.transports.File({
        filename: `./logs/${input.logName}/${input.logName}-Error.log`,
        level: "error",
        format
      }),
      // new winston.transports.File({
      //   filename: `./logs/${input.logName}/${input.logName}-Warn.log`,
      //   level: "warn",
      //   format
      // }),
      new winston.transports.File({
        filename: `./logs/${input.logName}/${input.logName}-All.log`,
        level: "silly",
        format,
      }),
      new winston.transports.File({
        filename: "./logs/globalLog.log",
        level: "silly",
        format,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: "./logs/rejections.log",
        format
      }),
    ],
  });

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== "production") {
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default wLogger;
