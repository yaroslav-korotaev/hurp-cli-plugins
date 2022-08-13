import type { Log } from 'hurp-types';
import { createPlugin } from 'hurp-cli';

export type ErrorContext = {
  log: Log;
};

const plugin = createPlugin<ErrorContext>();

export function error() {
  return plugin({
    middleware: async (ctx, args, next) => {
      try {
        await next();
      } catch (err) {
        process.exitCode = 1;
        ctx.log.error({ err });
      }
    },
  });
}
