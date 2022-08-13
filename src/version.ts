import fs from 'fs/promises';
import findUp from 'find-up';
import { createPlugin } from 'hurp-cli';

export type VersionContext = {
  version: string;
};

const plugin = createPlugin<VersionContext>();

export function version() {
  return plugin({
    options: {
      version: {
        type: 'boolean',
        description: 'Show version and exit',
      },
    },
    middleware: async (ctx, args, next, node) => {
      try {
        const path = await findUp('package.json', { cwd: require.main!.filename })!;
        const content = await fs.readFile(path!, { encoding: 'utf8' });
        const pkg = JSON.parse(content);
        
        ctx.version = pkg.version;
      } catch (err) {
        ctx.version = 'unknown';
      }
      
      if (args.version) {
        process.stdout.write(ctx.version + '\n');
      } else {
        await next();
      }
    },
  });
}
