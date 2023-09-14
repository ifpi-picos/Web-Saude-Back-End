import { Model } from 'mongoose';
import Endereco from '../models/Endereco';
import IEndereco from '../models/interfaces/IEndereco';
import IEnderecoService from './interfaces/IEnderecoService';

class EnderecoService implements IEnderecoService {
  private model: Model<IEndereco>;

  constructor() {
    this.model = Endereco;
  }
  public async cadastrarEndereco(
    enderecoData: IEndereco,
  ): Promise<IEndereco | null> {
    try {
      return await this.model.create(enderecoData);
    } catch (error) {
      throw new Endereco('Houve um erro interno ao salvar um novo endereço');
    }
  }

  public async alterarEndereco(
    id: string,
    enderecoData: IEndereco,
  ): Promise<IEndereco | null> {
    try {
      return await Endereco.findByIdAndUpdate(id, enderecoData, {
        new: true,
      });
    } catch (error) {
      throw new Endereco('Houve um erro interno ao alterar o endereço!!');
    }
  }

  public async deletarEndereco(id: string): Promise<void> {
    try {
      await Endereco.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Erro ao deletar o endereço');
    }
  }

  public async deletarTodosEnderecos(): Promise<void> {
    try {
      await Endereco.deleteMany({});
    } catch (error) {
      throw new Error('Erro ao deletar todos os endereços');
    }
  }
}

export default new EnderecoService();
