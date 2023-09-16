import { Model } from 'mongoose';
import IEnderecoRepository from './interfaces/IEnderecoRepository';
import IEndereco from '../models/interfaces/IEndereco';
import Endereco from '../models/Endereco';

class EnderecoRepository implements IEnderecoRepository {
	private model: Model<IEndereco>;

	constructor() {
		this.model = Endereco;
	}

	public async pegarEnderecos(): Promise<IEndereco[]> {
		try {
			return await this.model.find();
		} catch (error) {
			throw new Error('Erro ao listar os Endereços!' + error);
		}
	}
}

export default new EnderecoRepository();
