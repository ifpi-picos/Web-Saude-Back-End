import ISuporteService from './interfaces/ISuporteService';
import ISuporte from '../models/interfaces/ISuporte';
import Suporte from '../models/Suporte';
import { Model } from 'mongoose';

class SuportService implements ISuporteService {
	private model: Model<ISuporte>;

	constructor() {
		this.model = Suporte;
	}
	public async enviarMsg(menssagem: ISuporte): Promise<ISuporte | null> {
		try {
			return await this.model.create(menssagem);
		} catch (error) {
			throw new Error('Erro ao enviar Mensagem!');
		}
	}
}

export default new SuportService();
