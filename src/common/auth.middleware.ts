import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify, VerifyOptions } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			// Bearer eyjhd8asd7987789dasd81dh929u8d
			const jwtToken = req.headers.authorization.split(' ')[1];
			verify(jwtToken, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					// обогощаем request
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					req.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
