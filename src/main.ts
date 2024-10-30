import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 9000;
  app.enableCors(); // Habilita CORS si es necesario.
  await app.listen(port);
}
bootstrap();
