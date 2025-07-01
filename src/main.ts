import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appValidationPipe } from './common/pipes/validation.pipe';
import { sessionMiddleware } from './common/middleware/exp_ses.middleware';
import { configurePassportSession } from './common/middleware/pass-ses.middleware';
import { helmetMiddleware } from './common/security/helmet.middleware';
import { NotFoundExceptionFilter } from './common/middleware/notFoundException.middleware';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

async function bootstrap() {
  configurePassportSession(); // Set up passport session serialization
  const app = await NestFactory.create(AppModule);
  const notFoundFilter = new NotFoundExceptionFilter();
  app.useGlobalFilters(notFoundFilter);
  app.use(helmetMiddleware());
  app.enableCors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
    ],
    credentials: true,
  });
  app.useGlobalPipes(appValidationPipe);
  app.use(cookieParser());
  app.use(sessionMiddleware());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
