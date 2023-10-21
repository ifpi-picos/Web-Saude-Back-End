
import request from 'supertest';
import App from '../src/app';

const app = new App().express

describe('/clinicas rota', () => {
  it('deve retornar uma lista de clínicas', async () => {
    const response = await request(app).get('/clinicas');
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();

  });

});
