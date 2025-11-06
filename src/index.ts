import 'dotenv/config';
import 'reflect-metadata';
import { startServer } from './server';

startServer().catch((err) => {
  console.error('Failed to initialize the application.', err);
  process.exit(1);
});
