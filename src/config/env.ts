import 'dotenv/config';

type BooleanInput = string | number | boolean | undefined | null;

type DatabaseType = 'postgres';

interface DatabaseConfig {
  type: DatabaseType;
  url?: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  name: string;
  requireSsl?: boolean;
  synchronize: boolean;
  logging: ("query" | "error" | "schema" | "warn" | "info" | "log")[];
  runMigrations: boolean;
}

interface AppConfig {
  port: number;
  database: DatabaseConfig;
}

function normalizeBoolean(value: BooleanInput, defaultValue: boolean): boolean {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'n'].includes(normalized)) {
    return false;
  }
  return defaultValue;
}

export const env: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  database: {
    // on env file
    type: (process.env.DATABASE_TYPE as DatabaseType) || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME || '',
    requireSsl: normalizeBoolean(process.env.DATABASE_REQUIRE_SSL, false),
    // not on env file (with defaults)
    url: process.env.DATABASE_URL || undefined,
    synchronize: normalizeBoolean(process.env.DATABASE_SYNCHRONIZE, false),
    logging: ["error", "warn"],
    runMigrations: normalizeBoolean(process.env.DATABASE_RUN_MIGRATIONS, false),
  },
};

if (env.database.type !== 'postgres') {
  throw new Error(
    `Unsupported database type "${env.database.type}". Please use a postgres database.`
  );
}
