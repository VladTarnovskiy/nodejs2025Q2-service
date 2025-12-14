import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

enum ENestLoggerLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
}

const wrap = (open: string, close: string) => (s: string) =>
  `${open}${s}${close}`;

export const colors = {
  red: wrap('\x1b[31m', '\x1b[39m'),
  yellow: wrap('\x1b[33m', '\x1b[39m'),
  green: wrap('\x1b[32m', '\x1b[39m'),
  cyan: wrap('\x1b[36m', '\x1b[39m'),
};

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('App');
  private context?: string;

  private readonly toFile: boolean;
  private readonly filePath: string;
  private readonly fileMaxSizeBytes: number;
  private readonly fileMaxFiles: number;
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
    this.toFile = process.env.LOG_TO_FILE === 'true';
    this.filePath =
      process.env.LOG_FILE_PATH || path.join(process.cwd(), 'logs/app.log');
    const maxKb = Number(process.env.LOG_FILE_MAX_SIZE_KB || '2048');
    this.fileMaxSizeBytes = maxKb * 1024;
    this.fileMaxFiles = Number(process.env.LOG_FILE_MAX_FILES || '5');

    if (this.toFile) {
      this.checkAndCreateLogDir();
      this.checkAndCreateLogFile();
    }
  }

  public setContext(context?: string) {
    this.context = context;
  }

  public debug(message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(ENestLoggerLevel.DEBUG)) return;
    const line = colors.cyan(this.formatLine('DEBUG', message, meta)) + ' \n';
    process.stdout.write(line);
    this.writeFile(line);
  }

  public info(message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(ENestLoggerLevel.LOG)) return;
    const line = colors.green(this.formatLine('INFO', message, meta)) + ' \n';
    process.stdout.write(line);
    this.writeFile(line);
  }

  public warn(message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(ENestLoggerLevel.WARN)) return;
    const line = colors.yellow(this.formatLine('WARN', message, meta)) + ' \n';
    process.stdout.write(line);
    this.writeFile(line);
  }

  public error(message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(ENestLoggerLevel.ERROR)) return;
    const line = colors.red(this.formatLine('ERROR', message, meta)) + ' \n';
    process.stdout.write(line);
    this.writeFile(line);
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

  private writeFile(line: string) {
    if (!this.toFile) return;
    try {
      const buf = Buffer.from(line + '\n', 'utf8');
      this.checkFilesRotationIfNeeded(buf.length);
      fs.appendFileSync(this.filePath, buf);
    } catch (err) {
      this.logger.error(`File write error: ${(err as Error)?.message}`);
    }
  }

  private checkFilesRotationIfNeeded(nextChunkBytes: number) {
    try {
      const stat = fs.statSync(this.filePath);
      const nextSize = stat.size + nextChunkBytes;
      if (nextSize <= this.fileMaxSizeBytes) return;

      for (let i = this.fileMaxFiles - 1; i >= 1; i--) {
        const src = `${this.filePath}.${i}`;
        const dst = `${this.filePath}.${i + 1}`;
        if (fs.existsSync(src)) {
          fs.renameSync(src, dst);
        }
      }

      const first = `${this.filePath}.1`;
      fs.renameSync(this.filePath, first);

      this.checkAndCreateLogFile();
    } catch (err) {
      this.logger.error(`Log rotation error: ${(err as Error)?.message}`);
    }
  }

  private shouldLog(level: ENestLoggerLevel): boolean {
    return this.levelOrder[level] >= this.levelOrder[this.currentLevel];
  }

  private checkAndCreateLogDir() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private checkAndCreateLogFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '', { encoding: 'utf8' });
    }
  }

  private safeJson(obj: unknown): string {
    try {
      return JSON.stringify(obj);
    } catch {
      return String(obj);
    }
  }
}
