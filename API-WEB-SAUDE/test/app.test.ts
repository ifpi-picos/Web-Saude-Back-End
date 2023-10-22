import request from 'supertest';
import App from '../src/app';

const app = new App().express;

it('deve retornar status 201 e uma lista de hospitais', async () => {
	// Certifique-se de criar hospitais no banco de dados para este teste.
	const response = await request(app).get('/hospitais');
	expect(response.status).toBe(200);
	expect(response.body).toBeTruthy();
	// Você pode adicionar mais asserções específicas para os dados dos hospitais aqui.
});

it('deve retornar status 404 se nenhum hospital for encontrado', async () => {
	const response = await request(app).get('/hospitais');
	expect(response.status).toBe(404);
	expect(response.body).toEqual('Nenhum hsopital foi encontrado!'); // Corrigir a mensagem
});
