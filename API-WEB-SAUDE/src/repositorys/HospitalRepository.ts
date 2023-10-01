import { Model } from 'mongoose';
import IHospital from '../models/interfaces/IHospital';
import IHospitalRepository from './interfaces/IHospitalRepositorys';
import Hospital from '../models/Hospital';

class HospitailRepository implements IHospitalRepository {
	private model: Model<IHospital>;

	constructor() {
		this.model = Hospital;
	}
	public async pegarHospitais(): Promise<IHospital[]> {
		try {
			return await this.model
				.find()
				.populate('endereco')
				.populate('especialidades');
		} catch (error) {
			console.log(error);
			throw new Error('Erro ao Listas os Hospitais!' + error);
		}
	}
	public async pegarHospital(nome: string): Promise<IHospital | null> {
		try {
			return await this.model.findOne({ nome: nome });
		} catch (error) {
			throw new Error('Erro ao Filtrar o Hospital!' + error);
		}
	}
}
export default new HospitailRepository();
