const config = require("../config");
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLogLevel = logLevels[config.logLevel] || logLevels.info;

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

function shouldLog(level) {
  return logLevels[level] <= currentLogLevel;
}

module.exports = {
  error(message) {
    if (shouldLog("error")) {
      console.error(formatMessage("error", message));
    }
  },
  warn(message) {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message));
    }
  },
  info(message) {
    if (shouldLog("info")) {
      console.log(formatMessage("info", message));
    }
  },
  debug(message) {
    if (shouldLog("debug")) {
      console.log(formatMessage("debug", message));
    }
  },
};
