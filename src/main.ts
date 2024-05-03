import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // logger
  const logger = new Logger('Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS, // replace TCP to NATS
      options: {
       servers: envs.natsServers, // TCP: port: envs.port
      },
    },
  );

  // config global pipes validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // envs.port
  await app.listen();
  logger.log(`Products Microservice running on port: ${envs.port}`);
}
bootstrap();
