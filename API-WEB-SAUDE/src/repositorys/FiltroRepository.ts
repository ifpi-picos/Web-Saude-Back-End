import { Model } from 'mongoose';
import IClinica from '../models/interfaces/IClinica';
import IHospital from '../models/interfaces/IHospital';
import Clinica from '../models/Clinica';
import Hospital from '../models/Hospital';
import IFiltroRepository from './interfaces/IFiltroRepository';
import IEspecialidade from '../models/interfaces/IEspecialidades';
import Especialidades from '../models/Especialidades';

class FlltroRepository implements IFiltroRepository {
	private clinica: Model<IClinica>;
	private hospital: Model<IHospital>;
	private especialidades: Model<IEspecialidade>;

	constructor() {
		this.clinica = Clinica;
		this.hospital = Hospital;
		this.especialidades = Especialidades;
	}

	public async filtrar(nome: string): Promise<(IClinica | IHospital)[] | null> {
		try {
			const clinica = await this.clinica
				.find({ nome: nome })
				.populate('endereco')
				.populate('especialidades');

			const hospital = await this.hospital
				.find({ nome: nome })
				.populate('endereco')
				.populate('especialidades');

			if (clinica.length > 0) {
				return clinica;
			}
			if (hospital.length > 0) {
				return hospital;
			}

			const clinicas = await this.clinica
				.find()
				.populate('endereco')
				.populate({
					path: 'especialidades',
					match: { nome: nome },
				});

			const hospitais = await this.hospital
				.find()
				.populate('endereco')
				.populate({
					path: 'especialidades',
					match: { nome: nome },
				});

			const clinicasComEspecialidade = clinicas.filter(
				clinica => clinica.especialidades.length > 0,
			);

			const hospitaisComEspecialidade = hospitais.filter(
				hospital => hospital.especialidades.length > 0,
			);

			const clinicasEhospitais = [
				...clinicasComEspecialidade,
				...hospitaisComEspecialidade,
			];

			if (clinicasEhospitais.length > 0) {
				return clinicasEhospitais;
			}

			return null;
		} catch (error) {
			throw new Error('Erro ao filtrar!' + error);
		}
	}
}

export default new FlltroRepository();
