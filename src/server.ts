import { Server } from 'http';
import app from './app';
import { env } from './config/env';
import { AppDataSource } from './db/data-source';

export async function startServer(): Promise<Server> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();

    if (env.database.runMigrations) {
      await AppDataSource.runMigrations();
    }
  }

  const server = app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });

  return server;
}
