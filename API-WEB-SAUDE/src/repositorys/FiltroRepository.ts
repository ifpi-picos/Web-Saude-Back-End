import { Model } from 'mongoose';
import IClinica from '../models/interfaces/IClinica';
import IHospital from '../models/interfaces/IHospital';
import Clinica from '../models/Clinica';
import Hospital from '../models/Hospital';
import IEspecialidade from '../models/interfaces/IEspecialidades';
import Especialidades from '../models/Especialidades';

class FlltroRepository {
	private clinica: Model<IClinica>;
	private hospital: Model<IHospital>;
	private especialidade: Model<IEspecialidade>;

	constructor() {
		this.clinica = Clinica;
		this.hospital = Hospital;
		this.especialidade = Especialidades;
	}
	public async filtrar(
		nome: string,
	): Promise<IClinica | IHospital | IEspecialidade[] | null> {
		try {
			const clinica = await this.clinica
				.findOne({ nome: nome })
				.populate('endereco')
				.populate('especialidades');

			const hospital = await this.hospital
				.findOne({ nome: nome })
				.populate('endereco')
				.populate('especialidades');

			const especialidade = await this.especialidade
				.findOne({ nome: nome })
				.populate('clinicas')
				.populate('hospitais');

			if (clinica) {
				return clinica;
			}
			if (hospital) {
				return hospital;
			}
			if (especialidade) {
				return [especialidade];
			}
			return null;
		} catch (error) {
			throw new Error('Erro ao filtrar!' + error);
		}
	}
}

export default new FlltroRepository();
