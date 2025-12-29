// src/logging/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from '../services/logging.service';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      message =
        (typeof resp === 'string' ? resp : (resp as any)?.message) ||
        exception.message ||
        message;
    }

    this.logger.setContext('Exception');
    this.logger.error('Unhandled exception', {
      method: request?.method,
      url: request?.url,
      status,
      error: exception instanceof Error ? exception : undefined,
    });

    response.status(status).json({
      statusCode: status,
      message:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : message,
      timestamp: new Date().toISOString(),
      path: request?.url,
    });
  }
}
