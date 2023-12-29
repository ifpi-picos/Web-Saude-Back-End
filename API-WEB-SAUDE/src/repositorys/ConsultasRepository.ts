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

	public async buscar(nome: string): Promise<(IClinica | IHospital)[] | []> {
		try {
		  const nomeRegex = new RegExp(nome, 'i');
	  
		  const clinicas = await this.clinica
			.find({ nome: { $regex: nomeRegex },aprovado:true})
			.populate('endereco')
			.populate('especialidades');
	  
		  const hospitais = await this.hospital
			.find({ nome: { $regex: nomeRegex },aprovado:true})
			.populate('endereco')
			.populate('especialidades');
	  
		  const resultados = [...clinicas, ...hospitais];
	  
		  const resultadosComEspecialidade = resultados.filter(
			entidade => entidade.especialidades.length > 0,
		  );
	  
		  if (resultadosComEspecialidade.length > 0) {
			return resultadosComEspecialidade;
		  }
		  const clinicasComEspecialidade = await this.clinica
		  .find({aprovado:true})
		  .populate('endereco')
		  .populate({
			  path: 'especialidades',
			  match: { nome: { $regex: nomeRegex} },
		  });

	     const hospitaisComEspecialidade = await this.hospital
		  .find({aprovado:true})
		  .populate('endereco')
		  .populate({
			  path: 'especialidades',
			  match: { nome: { $regex: nomeRegex}},
		  });

			const resultadosClinica = clinicasComEspecialidade.filter(
				clinica => clinica.especialidades.length > 0,
			);

			const resultadosHospitais = hospitaisComEspecialidade.filter(
				hospital => hospital.especialidades.length > 0,
			);

			const clinicasEhospitais = [
				...resultadosClinica,
				...resultadosHospitais,
			];

			if (clinicasEhospitais.length > 0) {
				return clinicasEhospitais;
			}
		  return [];
		} catch (error) {
		  throw new Error('Erro ao filtrar!' + error);
		}
	  }
	  public async filtrarUnidadesDeSaudePelaEspecialidade(nome: string): Promise<(IClinica | IHospital)[] | []> {
		try {
		
			const clinicas = await this.clinica
				.find({aprovado:true})
				.populate('endereco')
				.populate({
					path: 'especialidades',
					match: { nome: nome },
				});

			const hospitais = await this.hospital
				.find({aprovado:true})
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
		const unidaeDeSaude  =  await this.pegarHospitalouClinica(nome)
		if(unidaeDeSaude){

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
			especialidade => especialidade.hospitais.length > 0,
		);

		if (especialidadesDaClinica.length > 0) {
			return especialidadesDaClinica;
		}
		if (especialidadesDoHospital.length > 0) {
			return especialidadesDoHospital;
		}
	}
		return [];
	}
	public async buscarUnidadesDeSaudePorPagina(pagina: number): Promise<(IClinica | IHospital)[]> {
		try {
		  const limitePorPagina = 4;
		  const skip = (pagina - 1) * limitePorPagina;
	  
		  const clinicas = await this.clinica
			.find()
			.populate('endereco')
			.populate('especialidades')
			.skip(skip)
			.limit(limitePorPagina);
	  
		  const hospitais = await this.hospital
			.find()
			.populate('endereco')
			.populate('especialidades')
			.skip(skip)
			.limit(limitePorPagina - clinicas.length);
	  
		  const resultados = [];
	  
		  resultados.push(...hospitais);
	  
		  resultados.push(...clinicas);
	  
		  return resultados.slice(0, limitePorPagina);
	  
		} catch (error) {
		  throw new Error('Erro ao filtrar unidades de saúde!' + error);
		}
	  }
	  
	public async contarTotalUnidadesDeSaude(): Promise<number> {
		try {
			const totalClinicas = await this.clinica.countDocuments();
			const totalHospitais = await this.hospital.countDocuments();
	
			return totalClinicas + totalHospitais;
		} catch (error) {
			throw new Error('Erro ao contar total de unidades de saúde: ' + error);
		}
	}
	public async pegarUnidadesDeSaudePeloTipo(
		tipo:string
	): Promise<IClinica[] | IHospital[] | []> {
		try {
			const hospital = await this.hospital
				.find({ tipo:tipo })
				.populate('endereco')
				.populate('especialidades');
			const clinica = await this.clinica
				.find({ tipo: tipo })
				.populate('endereco')
				.populate('especialidades');

				
			if (hospital.length > 0) {
				return hospital;
			}
			if (clinica.length > 0) {
				return clinica;
			}
			return [];
		} catch (error) {
			throw new Error('Erro ao pegar os dados!' + error);
		}
	}
	public async pegarUnidadesDeSaudePendentes(): Promise<
		(IClinica | IHospital)[] | []
	> {
		try {
			const hospitais = await this.hospital.find({aprovado:false}).populate('endereco')
			.populate('especialidades');
			const clinicas = await this.clinica.find({aprovado:false}).populate('endereco')
			.populate('especialidades');

			const hospitaiseClinicas = [...hospitais, ...clinicas];

			if (hospitaiseClinicas.length > 0) {
				return hospitaiseClinicas;
			}

			return [];
		} catch (error) {
			throw new Error('Erro ao listar!' + error);
		}
	}
}

export default new ConsultasRepoaitory();
