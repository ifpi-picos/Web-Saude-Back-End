import { Model } from 'mongoose';
import IClinica from '../models/interfaces/IClinica';
import IHospital from '../models/interfaces/IHospital';
import Clinica from '../models/Clinica';
import Hospital from '../models/Hospital';
import IConsultasRepository from './interfaces/IConsultasRepository';
import HospitalRepository from './HospitalRepository';
import ClinicaRepository from './ClinicaRepository';
import IEspecialidade from '../models/interfaces/IEspecialidades';
import Especialidades from '../models/Especialidades';

class ConsultasRepoaitory implements IConsultasRepository {
	private clinica: Model<IClinica>;
	private hospital: Model<IHospital>;
	private especialidades: Model<IEspecialidade>;

	constructor() {
		this.clinica = Clinica;
		this.hospital = Hospital;
		this.especialidades = Especialidades;
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
	public async pegarEspecialidadesDaUnidadeDeSaude(
		nome: string,
	): Promise<IEspecialidade[] | []> {
		const especialidadesDaCliincaData = await this.especialidades
			.find()
			.populate({
				path: 'clinicas',
				match: { nome: nome },
			});
		const especialidadesDoHospitalData = await this.especialidades
			.find()
			.populate({
				path: 'hospitais',
				match: { nome: nome },
			});

		const especialidadesDaClinica = especialidadesDaCliincaData.filter(
			especialidade => especialidade.clinicas.length > 0,
		);
		const especialidadesDoHospital = especialidadesDoHospitalData.filter(
			especialidade => especialidade.clinicas.length > 0,
		);

		if (especialidadesDaClinica.length > 0) {
			return especialidadesDaClinica;
		}
		if (especialidadesDoHospital.length > 0) {
			return especialidadesDoHospital;
		}
		return [];
	}
	public async pegarHospitaiseClinicasPorPagina(
		pagina: number,
	): Promise<{
		unidadesDeSaude: (IClinica | IHospital)[];
		totalPaginas: number;
	}> {
		try {
			const limitePorPagina = 4;

			const hospitais = await HospitalRepository.pegarHospitais();
			const clinicas = await ClinicaRepository.pegarClinicas();

			const hospitaiseClinicas = [...hospitais, ...clinicas];

			const totalUnidades = hospitaiseClinicas.length;
			const totalPaginas = Math.ceil(totalUnidades / limitePorPagina);

			const inicio = (pagina - 1) * limitePorPagina;
			const fim = pagina * limitePorPagina;

			const unidadesPorPagina = hospitaiseClinicas.slice(inicio, fim);

			return { unidadesDeSaude: unidadesPorPagina, totalPaginas };
		} catch (error) {
			throw new Error('Erro ao listar!' + error);
		}
	}
}

export default new ConsultasRepoaitory();
