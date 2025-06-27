import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: `Can't find ${request.originalUrl} on this server!`,
    });
  }
}

// Method 1: Create a single instance in main.ts
// const notFoundFilter = new NotFoundExceptionFilter();
// app.useGlobalFilters(notFoundFilter);

// Method 2: Register as a provider in AppModule (recommended)
// See app.module.ts configuration below
