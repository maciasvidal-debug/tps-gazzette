/**
 * Centralized logger utility for the Gazzette application.
 * This utility provides a consistent way to log messages and can be easily
 * extended to send logs to external monitoring services in production.
 */

type LogLevel = 'info' | 'warn' | 'error';

const log = (level: LogLevel, message: string, ...args: unknown[]) => {
  // In a real production environment, we might want to check the environment
  // and decide whether to log or send to an external service.
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  switch (level) {
    case 'info':
      console.info(formattedMessage, ...args);
      break;
    case 'warn':
      console.warn(formattedMessage, ...args);
      break;
    case 'error':
      console.error(formattedMessage, ...args);
      break;
  }
};

export const logger = {
  info: (message: string, ...args: unknown[]) => log('info', message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
};
