import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 

  await app.listen(3000);
  console.log('AI Transaction Analysis System running on http://localhost:3000');
}
bootstrap();
