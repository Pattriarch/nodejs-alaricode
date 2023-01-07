import { BaseController } from '../common/base.controller';
import { IControllerRoute } from '../common/route.interface';
import { LoggerService } from '../logger/logger.service';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';

export interface UsersControllerInterface {
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => void;
}
