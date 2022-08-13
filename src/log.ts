import type { Log } from 'hurp-types';
import { createPlugin } from 'hurp-cli';
import {
  LogLevel,
  Log as Logger,
} from 'uberlog';
import {
  Format as LogFormat,
  FORMATS,
} from 'uberlog-format';

export type LogContext = {
  log: Log;
};

const plugin = createPlugin<LogContext>();

export type LogOptions = {
  bindings?: object;
  defaultLevel?: LogLevel;
  defaultFormat?: LogFormat;
  maxDepth?: number;
};

export function log(options?: LogOptions) {
  return plugin({
    options: {
      logLevel: {
        type: 'string',
        description: 'Log level (debug, info, warn, error, silent)',
        default: options?.defaultLevel ?? 'info',
      },
      logFormat: {
        type: 'string',
        description: 'Log format (human, compact, json)',
        default: options?.defaultFormat ?? 'human',
      },
    },
    middleware: async (ctx, args, next) => {
      const {
        logLevel,
        logFormat,
      } = args;
      
      const formatOptions = options?.maxDepth ? { maxDepth: options.maxDepth } : undefined;
      const format = FORMATS[(logFormat ?? 'compact') as LogFormat];
      
      ctx.log = new Logger({
        level: (logLevel ?? 'info') as LogLevel,
        bindings: options?.bindings,
        format: format(formatOptions),
        stream: process.stdout,
      });
      
      await next();
    },
  });
}
