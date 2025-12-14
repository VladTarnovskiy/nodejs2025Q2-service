import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { LoggingService } from './common/services/logging.service';

dotenvExpand.expand(dotenv.config());

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  const loggingService = app.get(LoggingService);

  process.on('uncaughtException', (error) => {
    loggingService.setContext('Uncaught Exception');
    loggingService.error('Uncaught Exception:', { error });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    loggingService.setContext('Unhandled Rejection');
    loggingService.error('Unhandled Rejection at:', { reason, promise });
    process.exit(1);
  });
}
bootstrap();
