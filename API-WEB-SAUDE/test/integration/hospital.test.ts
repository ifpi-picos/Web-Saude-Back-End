import request from 'supertest';
import App from '../../src/app';
import http from 'http';
import { describe } from 'node:test';

const app = new App().express;

let server: any;

beforeAll(done => {
	server = http.createServer(app);
	server.listen(0, () => {
		done();
	});
});

afterAll(done => {
	server.close((err: Error) => {
		if (err) {
			console.error('Erro ao fechar o servidor:', err);
		} else {
			console.log('Servidor fechado com sucesso.');
		}
		done();
	});
});

describe('Testes para a rota de hospitais', () => {
	it('deve retorna uma lista de cliincas!', async () => {
		const response = await request(app).get('/hospitais');
		expect(response.status).toBe(200);
		expect(response.body).toBeTruthy();
	});
});
