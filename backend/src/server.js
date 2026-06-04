import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './shared/prisma/client.js';

async function bootstrap() {
  try {
    await prisma.$connect();

    console.log('PostgreSQL connected');

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Server bootstrap error:', error);

    process.exit(1);
  }
}

bootstrap();