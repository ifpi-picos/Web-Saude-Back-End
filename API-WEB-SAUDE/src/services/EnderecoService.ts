import { Model ,Types } from 'mongoose';
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
			throw new Endereco('Erro ao salvar o Endereço!' + error);
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
			throw new Endereco('Erro ao altrar o Endereço!' + error);
		}
	}

	public async deletarEndereco(id: string): Promise<void> {
		try {
			await Endereco.findByIdAndDelete(id);
		} catch (error) {
			throw new Error('Erro ao deletar o Endereço!' + error);
		}
	}

	public async deletarTodosEnderecos(): Promise<void> {
		try {
			await Endereco.deleteMany({});
		} catch (error) {
			throw new Error('Erro ao deletar todos os Endereços!' + error);
		}
	}
	
	public async deletarEnderecosAssociadosAUnidadesDeSaude(ids: string[]): Promise<void> {
		try {
		  // Converte os IDs para o tipo ObjectId do Mongoose
		  const objectIdArray = ids.map((id) => new Types.ObjectId(id));
	
		  // Deleta todas as clínicas cujos IDs estão na lista
		  await this.model.deleteMany({ _id: { $in: objectIdArray } });
		} catch (error) {
		  throw new Error('Erro ao Deletar as Clínicas por IDs!' + error);
		}
	  }
}

export default new EnderecoService();
