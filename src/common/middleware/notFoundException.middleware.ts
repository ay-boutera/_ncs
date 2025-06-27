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

    // Get the exception message
    const exceptionResponse = exception.getResponse();
    let message: string;

    // Check if it's a custom message from your services
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse['message']
    ) {
      message = exceptionResponse['message'];
    } else {
      // Default route not found message
      message = `Can't find ${request.originalUrl} on this server!`;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      message: message,
      suggestion:
        'Please check the URL or resource ID. If you believe this is an error, contact support with the above details.',
    });
  }
}
