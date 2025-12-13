import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

enum ENestLoggerLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
}

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('App');
  private context?: string;

  private readonly levelOrder: Record<ENestLoggerLevel, number> = {
    [ENestLoggerLevel.DEBUG]: 10,
    [ENestLoggerLevel.LOG]: 20,
    [ENestLoggerLevel.WARN]: 30,
    [ENestLoggerLevel.ERROR]: 40,
  };
  private readonly currentLevel: ENestLoggerLevel;

  constructor() {
    this.currentLevel =
      (process.env.LOG_LEVEL as ENestLoggerLevel) || ENestLoggerLevel.LOG;
  }

  public setContext(context?: string) {
    this.context = context;
  }

  public debug(message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(ENestLoggerLevel.DEBUG)) return;
    const line = this.formatLine('DEBUG', message, meta);
    this.logger.debug(line);
  }

  public info(message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(ENestLoggerLevel.LOG)) return;
    const line = this.formatLine('INFO', message, meta);
    this.logger.log(line);
  }

  public warn(message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(ENestLoggerLevel.WARN)) return;
    const line = this.formatLine('WARN', message, meta);
    this.logger.warn(line);
  }

  public error(message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(ENestLoggerLevel.ERROR)) return;
    const line = this.formatLine('ERROR', message, meta);
    this.logger.error(line);
  }

  private formatLine(
    level: string,
    message: string,
    meta?: Record<string, unknown>,
  ): string {
    const ts = new Date().toISOString();
    const ctx = this.context ? `[${this.context}] ` : '';
    const metaStr = meta ? ` ${this.safeJson(meta)}` : '';
    return `${ts} ${level}: ${ctx}${message}${metaStr}`;
  }

  private shouldLog(level: ENestLoggerLevel): boolean {
    return this.levelOrder[level] >= this.levelOrder[this.currentLevel];
  }

  private safeJson(obj: unknown): string {
    try {
      return JSON.stringify(obj);
    } catch {
      return String(obj);
    }
  }
}
