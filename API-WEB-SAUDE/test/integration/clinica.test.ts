import request from 'supertest';
import App from '../../src/app';

const app = new App().express;

describe('Testes para a rota de clinicas', () => {
 
  it('deve criar uma nova clínica', async () => {
    const novaClinicaData = {
      cep: '12345-678', 
      rua: 'Rua Exemplo', 
      numero: '123',
      bairro: 'Bairro Exemplo', 
      cidade: 'Cidade Exemplo', 
      uf: 'UF',
      nome: 'NomedaClinica',
      imagem: 'URL da imagem',
      horarioSemana: {
        open: '08:00',
        close: '17:00',
      },
      sabado: {
        open: '09:00',
        close: '13:00',
      },
      longitude: -47.123456, 
      latitude: -22.987654, 
      especialidades: ["653175ce6de08f1bcf9f8756"],
      instagram: 'instagram.com/nome-da-clinica',
      email: 'contato@clinicademo.com',
      whatsapp: '+1234567890',
      descricao: 'Descrição da Clínica',
    };

    const response = await request(app)
      .post('/admin/nova-clinica')
      .send(novaClinicaData);
      
    expect(response.status).toBe(201);
    expect(response.body.Message).toBe('Clínica salva com Sucesso!');
    expect(response.body.data).toBeTruthy();
  });

  it('deve alterar uma clínica existente', async () => {
    const id = "653aedc8de051db69499de8a";

    const clinicaAtualizadaData = {
      cep: '54321-876',
      rua: 'Nova Rua',
      numero: '321',
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      uf: 'UF2',
      nome: 'NovoNomeClinica',
      imagem: 'Nova URL da imagem',
      horarioSemana: {
        open: '09:00',
        close: '18:00',
      },
      sabado: {
        open: '10:00',
        close: '14:00',
      },
      longitude: -48.123456, 
      latitude: -23.987654, 
      especialidades: ["653176366de08f1bcf9f877a"],
      instagram: 'instagram.com/nova-clinica',
      email: 'contato@novaclinicademo.com',
      whatsapp: '+9876543210',
      descricao: 'Nova Descrição da Clínica',
    };

    const response = await request(app)
      .put(`/admin/alterar-clinica/${id}`).send(clinicaAtualizadaData);


    expect(response.status).toBe(201);
    expect(response.body.Message).toBe('Clínica Atualizada com Sucesso!');
    expect(response.body.data).toBeTruthy();
  });

  it('deve deletar uma clínica específica', async () => {
    const id = "653af28909f42a26edebdade";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTMxYzJiZmY1OTE2Y2JkMTRkZTliMGMiLCJpYXQiOjE2OTgzNzI0MjcsImV4cCI6MTY5ODM3NjAyN30.GHkKI7xp31uvc4J6T2ix5LrfDJSzU5LMfkxXc61z6G4";
    const response = await request(app)
    .delete(`/admin/deletar-clinica/${id}`)
    .set('x-access-token', `${token}`);
	expect(response.status).toBe(204);
  })
  it('deve retornar uma lista de clínicas', async () => {
    const response = await request(app).get('/clinicas');
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it('deve retornar uma clínica específica', async () => {
    const response = await request(app).get('/clinica/NovoNomeClinica');
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
});
