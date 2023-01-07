import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

// замокаем элементы UserService
const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

// замокаем элементы UserService
const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UserService).to(UsersService);
	// inversify может биндить не только на класс, но и на константу
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUsersService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		// если один раз вызовём этот метод, то вернем какое-то значение
		configService.get = jest.fn().mockReturnValueOnce(1);
		// при вызове данного метода получим такого юзера
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'a@a.ru',
			name: 'Вася',
			password: 'asdasd',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('asdasd');
	});

	// 1 - пароли одинаковы
	it('validateUser 1', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validateUser({
			email: 'a@a.ru',
			password: 'asdasd',
		});
		expect(result).toBeTruthy();
	});

	// 2 - пароли разные
	it('validateUser 2', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validateUser({
			email: createdUser?.email ?? '',
			password: 'not equal',
		});
		expect(result).toBeFalsy();
	});

	// 3 - пользователь не найден
	it('validateUser 3', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.validateUser({
			email: 'not@found.ru',
			password: 'asdasd',
		});
		expect(result).toBeFalsy();
	});
});
