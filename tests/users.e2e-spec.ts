import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	// регистрируем существующего пользователя
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'a@a.ru', password: 'asdasd' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - success ', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.ru', password: 'asdasd' });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error ', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.ru', password: 'asdasd' });
		expect(res.statusCode).toBe(401);
	});

	it('Info JWT - success ', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.ru', password: 'asdasd' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body).toBe({ email: 'a@a.ru', id: 1 });
	});

	it('Info JWT - error ', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.ru', password: 'asdasd' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', 'Bearer ERROR');
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
