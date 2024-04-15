import * as path from 'path';
import * as winston from 'winston';
import { env } from '../../env';

type LogLevel =
    | 'error'
    | 'warn'
    | 'info'
    | 'http'
    | 'verbose'
    | 'debug'
    | 'silly';

class Logger {
    public static DEFAULT_SCOPE = 'app';
    private readonly scope: string;
    private readonly logger: winston.Logger;

    constructor(scope?: string) {
        this.scope = Logger.parsePathToScope(
            scope ? scope : Logger.DEFAULT_SCOPE
        );
        this.logger = winston.createLogger({
            level: env.node === 'development' ? 'debug' : 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.printf(({ level, message }) => {
                    if (message instanceof Error) {
                        message = message.stack;
                    }
                    return `${level}: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console({ stderrLevels: ['error'] }),
            ],
        });
    }

    private static parsePathToScope(filepath: string): string {
        return filepath
            .replace(
                new RegExp(
                    `(${path.sep}src${path.sep}|${path.sep}dist${path.sep}|.ts|.js)`,
                    'g'
                ),
                ''
            )
            .replace(process.cwd(), '')
            .replace(path.sep, ':');
    }

    public debug(message: string, ...args: any[]): void {
        this.log('debug', message, ...args);
    }

    public info(message: string, ...args: any[]): void {
        this.log('info', message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        this.log('warn', message, ...args);
    }

    public error(message: string, ...args: any[]): void {
        this.log('error', message, ...args);
    }

    private log(level: LogLevel, message: string, ...args: any[]): void {
        this.logger.log(level, message, args);
    }
}

export { LogLevel, Logger };
