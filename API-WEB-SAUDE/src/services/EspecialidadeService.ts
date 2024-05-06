import { Especialidade } from '../models/Especialidades';
import { AppDataSource } from '../database/db';

class EspecialidadeService {
  private especialidadeRepository = AppDataSource.getRepository(Especialidade);
  
  async salvarEspecialidade(especialidadeData: Partial<Especialidade>): Promise<Especialidade | null> {
    try {
      const { nome } = especialidadeData;
      const especialidadeExistente = await this.especialidadeRepository.findOne({ where: { nome } });
      if (especialidadeExistente) {
        return null
      }
      
      const novaEspecialidade = this.especialidadeRepository.create(especialidadeData);
      return await this.especialidadeRepository.save(novaEspecialidade);
    } catch (error) {
      console.log(error);
      throw error

    } 
  }

  async alterarEspecialidade(id: number, especialidadeData: Partial<Especialidade>): Promise<Especialidade> {
    try {
      
      const especialidadeExistente = await this.especialidadeRepository.findOne({ where: { id } });
  
      const especialidadeAtualizada = await this.especialidadeRepository.save({
        ...especialidadeExistente,
        ...especialidadeData,
      });
      return especialidadeAtualizada;
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }
  

  async deletarEspecialidade(id: number): Promise<boolean> {
    try {
      const resultado = await this.especialidadeRepository.delete(id);
      return resultado.affected === 1;
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');

    }
  }

  async obterTodasEspecialidades(): Promise<Especialidade[]> {
    try {
      return await this.especialidadeRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async obterEspecialidadePorId(id: number): Promise<Especialidade | null> {
    try {
      return await this.especialidadeRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');

    }
  }
  async obterEspecialidadePorNome(nome: string): Promise<Especialidade | null> {
    try {
      return await this.especialidadeRepository.findOne({ where: { nome } });
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }
}

export default new EspecialidadeService();