import { Endereco } from '../models/Endereco';
import { AppDataSource } from '../database/db';

class EnderecoService {
  private enderecoRepository = AppDataSource.getRepository(Endereco);
  
  async salvarEndereco(enderecoData: Partial<Endereco>): Promise<Endereco> {
    try {
    
      const novoEndereco = this.enderecoRepository.create(enderecoData);
      return await this.enderecoRepository.save(novoEndereco);
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }

  async alterarEndereco(id: number, enderecoData: Partial<Endereco>): Promise<Endereco> {
    try {
      const enderecoExistente = await this.enderecoRepository.findOne({ where: { id } });
  
      const enderecoAtualizado = await this.enderecoRepository.save({
        ...enderecoExistente,
        ...enderecoData,
      });
      return enderecoAtualizado;
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }

  async deletarEndereco(id: number): Promise<boolean> {
    try {
      const resultado = await this.enderecoRepository.delete(id);
      return resultado.affected === 1;
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }

}

export default new EnderecoService();