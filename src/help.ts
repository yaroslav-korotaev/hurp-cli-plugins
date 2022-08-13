import asTable from 'as-table';
import { createPlugin } from 'hurp-cli';

export type HelpContext = {
  help: () => void;
};

const plugin = createPlugin<HelpContext>();

export function help() {
  return plugin({
    recursive: true,
    options: {
      help: {
        type: 'boolean',
        description: 'Show help and exit',
      },
    },
    middleware: async (ctx, args, next, node) => {
      ctx.help = () => {
        let text = node.name;
        
        if (node.usage) {
          text = `${text} ${node.usage}`;
        }
        
        if (node.description) {
          text = `${text} - ${node.description}`;
        }
        
        if (node.children) {
          text += '\n\nCommands:\n';
          
          const rows: string[][] = [];
          for (const child of node.children) {
            const cols = [
              `  ${child.name}`,
              (child.description) ? `- ${child.description}` : '',
            ];
            
            rows.push(cols);
          }
          
          text += asTable(rows);
        }
        
        if (Object.keys(node.options).length > 0) {
          text += '\n\nOptions:\n';
          
          const rows: string[][] = [];
          for (const [key, option] of Object.entries(node.options)) {
            let spec = key;
            
            if (option.type != 'boolean') {
              spec = `${spec} ${(option.required) ? `<${option.type}>` : `[${option.type}]`}`;
            }
            
            const cols = [
              `  --${spec}`,
              (option.description) ? `- ${option.description}` : '',
            ];
            
            rows.push(cols);
          }
          
          text += asTable(rows);
        }
        
        process.stdout.write(text + '\n');
      };
      
      if (args.help) {
        ctx.help();
      } else {
        await next();
      }
    },
  });
}
