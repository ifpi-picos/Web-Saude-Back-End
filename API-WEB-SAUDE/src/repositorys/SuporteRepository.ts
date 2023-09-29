/*import ISuporteRepository from './interfaces/ISuporteRespository';
import ISuporte from '../models/interfaces/ISuporte';
import Suporte from '../models/Suporte';
import { Model } from 'mongoose';

class SuporteRepository implements ISuporteRepository {
	private model: Model<ISuporte>;

	constructor() {
		this.model = Suporte;
	}

	public async mensagensRecebidoas(): Promise<ISuporte[]> {
		try {
			return await this.model.find();
		} catch (error) {
			throw new Error('Erro ao listar Mensagens!');
		}
	}
}

export default new SuporteRepository();
*/
