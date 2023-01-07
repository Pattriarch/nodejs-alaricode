import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify, VerifyOptions } from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IUsersService } from '../users/users.service.interface';
import { IUsersRepository } from '../users/users.repository.interface';

export class AuthGuard implements IMiddleware {
	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'Человек не авторизован' });
	}
}
