import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Allows the local Vite frontend to call the API during development.
  app.enableCors({ origin: 'http://localhost:5173' });
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
