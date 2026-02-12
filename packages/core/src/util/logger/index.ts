export type LogLevel = "debug" | "info" | "warn" | "error";

export type Logger = {
  debug: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
};

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function createLogger(name: string, level: LogLevel = "debug"): Logger {
  const minLevel = LOG_LEVELS[level];

  function serialize(data: unknown): string {
    if (data instanceof Error) {
      return JSON.stringify({ name: data.name, message: data.message, stack: data.stack }, null, 2);
    }
    return JSON.stringify(data, null, 2);
  }

  function log(logLevel: LogLevel, message: string, data?: unknown) {
    if (LOG_LEVELS[logLevel] < minLevel) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${logLevel.toUpperCase()}] [${name}]`;

    if (data !== undefined) {
      console[logLevel === "debug" ? "log" : logLevel](`${prefix} ${message}`, serialize(data));
    } else {
      console[logLevel === "debug" ? "log" : logLevel](`${prefix} ${message}`);
    }
  }

  return {
    debug: (message, data) => log("debug", message, data),
    info: (message, data) => log("info", message, data),
    warn: (message, data) => log("warn", message, data),
    error: (message, data) => log("error", message, data),
  };
}
