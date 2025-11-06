import path from 'path';
import { DataSource } from 'typeorm';
import { env } from '../config/env';

const baseOptions = {
  type: 'postgres' as const,
  synchronize: env.database.synchronize,
  logging: env.database.logging,
  migrationsRun: env.database.runMigrations,
  entities: [path.join(__dirname, '../entities/*.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  ssl:
    env.database.requireSsl
    ? undefined
    : { rejectUnauthorized: false },
};

const connectionOptions = env.database.url
  ? { url: env.database.url }
  : {
      host: env.database.host,
      port: env.database.port,
      username: env.database.username,
      ...(env.database.password !== undefined
        ? { password: env.database.password }
        : {}),
      database: env.database.name,
    };

export const AppDataSource = new DataSource({
  ...baseOptions,
  ...connectionOptions,
});
