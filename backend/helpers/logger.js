const winston = require("winston");
require("winston-daily-rotate-file");
const options = { timeZone: "Europe/Paris", timeZoneName: "short" };
const timezoned = () => {
  return new Date().toLocaleString("en-fr", options);
};
const myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    debug: "white",
    info: "cyan",
    silly: "white",
    warn: "yellow",
    http: "magenta",
    error: "red",
  },
};
alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.timestamp({
    format: "DD-MM-YY HH:MM:SS",
  }),
  winston.format.printf(
    (info) => `${info.timestamp}  ${info.level} : ${info.message}`
  )
);
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  exitOnError: false,
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.DailyRotateFile({
      filename: "error-%DATE%.log",
      dirname: `./logs/`,
      level: "warn",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: timezoned }),
        winston.format.json()
      ),
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new winston.transports.DailyRotateFile({
      filename: "info-%DATE%.log",
      dirname: `./logs/`,
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: timezoned }),
        winston.format.json()
      ),
      handleExceptions: true,
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

logger.stream = {
  write: function (message, encoding) {
    logger.error(message);
  },
};

winston.addColors(myCustomLevels.colors);
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      level: "silly",
      handleExceptions: true,
      colorize: true,
      format: winston.format.cli(),
    })
  );
}

module.exports = { logger };
