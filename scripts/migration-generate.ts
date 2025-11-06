import { spawnSync } from 'child_process';
import path from 'path';

const nameFromArgs = process.env.npm_config_name || process.argv[2];
const defaultName = `auto_${new Date().toISOString().replace(/[-:T.Z]/g, '')}`;
const sanitizedName = (nameFromArgs && nameFromArgs.trim().length > 0
  ? nameFromArgs
  : defaultName
).replace(/\s+/g, '_');
const migrationsDir = path.resolve(__dirname, '../src/migrations');
const outputPath = path.join(migrationsDir, sanitizedName);

const command = `npx ts-node --project tsconfig.json ./node_modules/typeorm/cli.js -d ./src/db/data-source.ts migration:generate "${outputPath}"`;

const result = spawnSync(command, {
  stdio: 'inherit',
  shell: true,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
