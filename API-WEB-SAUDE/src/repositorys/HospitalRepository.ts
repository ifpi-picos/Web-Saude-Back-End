import { Model } from 'mongoose';
import IHospital from '../models/interfaces/IHospital';
import IHospitalRepository from './interfaces/IHospitalRepositorys';
import Hospital from '../models/Hospital';
import EspecialidadesRepository from './EspecialidadesRepository';

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
	public async pegarHospitalPelaEspecialidade(
		nome: string,
	): Promise<IHospital[] | null> {
		try {
			const especialidade = await EspecialidadesRepository.pegarEspecialidade(
				nome,
			);
			if (!especialidade) {
				throw new Error('Especialidade não Encontrada!');
			}
			const clinicas = await this.model.find({}).populate('especialidades');
			const clinicasFiltradas = clinicas.filter(clinica =>
				clinica.especialidades.some(
					especialidadeClinica =>
						especialidadeClinica._id.toString() ===
						especialidade._id.toString(),
				),
			);
			return clinicasFiltradas;
		} catch (error) {
			throw new Error(
				'Erro ao Filtrar os Hospitais pela Especialidades!' + error,
			);
		}
	}
}
export default new HospitailRepository();
