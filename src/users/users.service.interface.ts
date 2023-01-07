import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { interfaces } from 'inversify';
import Request = interfaces.Request;
import { NextFunction, Response } from 'express';
import { UserModel } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';

export interface IUsersService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: ({ email, password }: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}
