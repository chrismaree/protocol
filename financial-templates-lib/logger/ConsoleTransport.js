// This transport enables Winston logging to the console.
const winston = require("winston");
const { format } = winston;
const { combine, timestamp, colorize, printf } = format;

const customFormat = combine(
  // Adds level-based coloring.
  colorize(),
  // Adds timestamp.
  timestamp(),
  printf(info => {
    const { timestamp, level, error, ...args } = info;

    // This slice changes a timestamp formatting from `2020-03-25T10:50:57.168Z` -> `2020-03-25 10:50:57`
    const ts = timestamp.slice(0, 19).replace("T", " ");
    let log = `${ts} [${level}]: ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ""}`;

    // Winston does not properly log Error objects like console.error() does, so this formatter will search for the Error object
    // in the "error" property of "info", and add the error stack to the log.
    // Discussion at https://github.com/winstonjs/winston/issues/1338.
    if (error) {
      log = `${log}\n${error}`;
    }
    return log;
  })
);

function createConsoleTransport() {
  return new winston.transports.Console({
    handleExceptions: true,
    format: customFormat
  });
}

module.exports = { createConsoleTransport };
