import { Model } from 'mongoose';
import IClinica from '../models/interfaces/IClinica';
import IHospital from '../models/interfaces/IHospital';
import Clinica from '../models/Clinica';
import Hospital from '../models/Hospital';
import IConsultasRepository from './interfaces/IConsultasRepository';
import HospitalRepository from './HospitalRepository';
import ClinicaRepository from './ClinicaRepository';

class ConsultasRepoaitory implements IConsultasRepository {
	private clinica: Model<IClinica>;
	private hospital: Model<IHospital>;

	constructor() {
		this.clinica = Clinica;
		this.hospital = Hospital;
	}

	public async filtrar(nome: string): Promise<(IClinica | IHospital)[] | []> {
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

			return [];
		} catch (error) {
			throw new Error('Erro ao filtrar!' + error);
		}
	}

	public async pegarHospitaiseClinicas(): Promise<
		(IClinica | IHospital)[] | []
	> {
		try {
			const hospitais = await HospitalRepository.pegarHospitais();
			const clinicas = await ClinicaRepository.pegarClinicas();

			const hospitaiseClinicas = [...hospitais, ...clinicas];

			if (hospitaiseClinicas.length > 0) {
				return hospitaiseClinicas;
			}

			return [];
		} catch (error) {
			throw new Error('Erro ao listar!' + error);
		}
	}
	public async pegarHospitalouClinica(
		nome: string,
	): Promise<IClinica | IHospital | []> {
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
			return [];
		} catch (error) {
			throw new Error('Erro ao pegar os dados!' + error);
		}
	}
	public async pegarEspecialidadesPeloNomeDaUnidadeDeSaude(
		nome: string,
	): Promise<string[]> {
		try {
			const hospital = await this.hospital
				.findOne({ nome: nome })
				.populate('especialidades', 'nome');
			const clinica = await this.clinica
				.findOne({ nome: nome })
				.populate('especialidades', 'nome');

			const especialidades = [];

			if (hospital) {
				for (const especialidade of hospital.especialidades) {
					especialidades.push(especialidade.nome);
				}
			}

			if (clinica) {
				for (const especialidade of clinica.especialidades) {
					especialidades.push(especialidade.nome);
				}
			}

			return especialidades;
		} catch (error) {
			throw new Error('Erro ao listar especialidades!' + error);
		}
	}
}

export default new ConsultasRepoaitory();
