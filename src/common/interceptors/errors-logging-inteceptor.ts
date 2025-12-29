// src/logging/request-response-logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class RequestResponseLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const started = Date.now();
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { ip?: string }>();
    const res = http.getResponse<any>();

    const method = (req as any)?.method;
    const url = (req as any)?.url;
    const query = (req as any)?.query;
    const body = (req as any)?.body;

    this.logger.setContext('HTTP');
    this.logger.info('Incoming request', {
      method,
      url,
      ip: (req as any)?.ip,
      query,
      body,
    });

    return next.handle().pipe(
      tap(() => {
        const status = res?.statusCode ?? 200;
        const durationMs = Date.now() - started;
        this.logger.info('Response sent', { method, url, status, durationMs });
      }),
      catchError((err) => {
        const status =
          typeof (err as any)?.getStatus === 'function'
            ? (err as any).getStatus()
            : 500;
        const durationMs = Date.now() - started;
        this.logger.warn('Request failed', { method, url, status, durationMs });
        return throwError(() => err);
      }),
    );
  }
}
