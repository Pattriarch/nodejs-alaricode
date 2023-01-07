import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { inject, injectable, interfaces } from 'inversify';
import { IUsersService } from './users.service.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';
import { compare } from 'bcryptjs';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const user = await this.usersRepository.find(email);
		if (!user) {
			return false;
		}
		const newUser = new User(user.email, user.name, user.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return await this.usersRepository.find(email);
	}
}
