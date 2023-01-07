import { injectable } from 'inversify';
import { Logger } from 'tslog';
import { ILogger } from './logger.interface';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger<string>;

	constructor() {
		this.logger = new Logger({
			name: 'MyLogger',
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		// отправка в sentry / rollbar
		this.logger.error(...args);
	}
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
