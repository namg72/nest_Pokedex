import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { transcode } from 'buffer';
import { Transform } from 'class-transformer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Vamos a añadire el prefijo api / v2 
  app.setGlobalPrefix('api/v2');

  //Configuramos ValidationPipe a nivel global
  app.useGlobalPipes(
    new ValidationPipe({
      
      whitelist: true,
      forbidNonWhitelisted: true,
      transform:true,
      transformOptions:{
        enableImplicitConversion:true
      }
    })

  )

  await app.listen(process.env.PORT);
}
bootstrap();
