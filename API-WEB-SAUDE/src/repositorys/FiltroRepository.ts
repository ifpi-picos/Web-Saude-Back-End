import { Model } from 'mongoose';
import IClinica from '../models/interfaces/IClinica';
import IHospital from '../models/interfaces/IHospital';
import Clinica from '../models/Clinica';
import Hospital from '../models/Hospital';
import IFiltroRepository from './interfaces/IFiltroRepository';
import HospitalRepository from './HospitalRepository';
import ClinicaRepository from './ClinicaRepository';

class FlltroRepository implements IFiltroRepository {
	private clinica: Model<IClinica>;
	private hospital: Model<IHospital>;

	constructor() {
		this.clinica = Clinica;
		this.hospital = Hospital;
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

	public async pegarHospitaiseClinicas(): Promise<
		(IClinica | IHospital)[] | null
	> {
		try {
			const hospitais = await HospitalRepository.pegarHospitais();
			const clinicas = await ClinicaRepository.pegarClinicas();

			const hospitaiseClinicas = [...hospitais, ...clinicas];
			console.log(hospitaiseClinicas);

			if (hospitaiseClinicas.length > 0) {
				return hospitaiseClinicas;
			}

			return null;
		} catch (error) {
			throw new Error('Erro ao listar!' + error);
		}
	}
	public async pegarHospitalouClinica(
		nome: string,
	): Promise<IClinica | IHospital | null> {
		try {
			const hospital = await this.hospital
				.findOne({ nome: nome })
				.populate('endereco')
				.populate('especialidades');
			const clinica = await this.clinica
				.findOne({ nome: nome })
				.populate('endereco')
				.populate('especialidades');
			if (hospital) {
				return hospital;
			}
			if (clinica) {
				return clinica;
			}
			return null;
		} catch (error) {
			throw new Error('Erro ao pegar os dados!' + error);
		}
	}
}

export default new FlltroRepository();
