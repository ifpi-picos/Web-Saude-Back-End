import { Model, Types } from 'mongoose';
import IClinicaService from './interfaces/IClinicaService';
import IClinica from '../models/interfaces/IClinica';
import Clinica from '../models/Clinica';
import ClinicaRepository from '../repositorys/ClinicaRepository';
import EnderecoService from './EnderecoService';
import Especialidades from '../models/Especialidades';

class ClinicaService implements IClinicaService {
	private model: Model<IClinica>;

	constructor() {
		this.model = Clinica;
	}
	public async novaClinica(clinicaData: IClinica): Promise<IClinica | null> {
		try {
			const clinicaExistente = await ClinicaRepository.pegarClinica(
				clinicaData.nome,
			);

			if (clinicaExistente) {
				return null;
			}
			const novaClinica = await this.model.create(clinicaData);
			return novaClinica;
		} catch (error) {
			throw new Error('Erro ao Salvar a Clínica!' + error);
		}
	}
	public async alterarClinica(
		clinicaId: string,
		clinicaData: IClinica,
	): Promise<IClinica | null> {
		try {
			const clinicaExistente = await this.model.findById(clinicaId);

			if (!clinicaExistente) {
				throw new Error('Clínica não encontrada para atualização');
			}

			if (clinicaData.nome !== clinicaExistente.nome) {
				const clinicaComMesmoNome = await ClinicaRepository.pegarClinica(
					clinicaData.nome,
				);

				if (clinicaComMesmoNome) {
					return null;
				}
			}

			const atualizarClinica = await this.model.findByIdAndUpdate(
				clinicaId,
				clinicaData,
				{ new: true },
			);

			if (atualizarClinica === null) {
				throw new Error('Clínica não encontrada para atualização');
			}

			return atualizarClinica;
		} catch (error) {
			throw new Error('Erro ao Atualizar a Clínica!' + error);
		}
	}

	public async deletarClinica(clinicaId: string): Promise<IClinica | null> {
		try {
			return await this.model.findByIdAndDelete(clinicaId);
		} catch (error) {
			throw new Error('Erro ao Deletar a Clínica!' + error);
		}
	}

	public async deletarClinicasDoUsuario(ids: string[]): Promise<void> {
		try {
			const objectIdArray = ids.map(id => new Types.ObjectId(id));

			const clínicasParaDeletar = await this.model.find({
				_id: { $in: objectIdArray },
			});

			const idsDasClinicas = clínicasParaDeletar.map(clinica =>
				clinica._id.toString(),
			);

			await Especialidades.updateMany(
				{ clinicas: { $in: idsDasClinicas } },
				{ $pullAll: { clinicas: idsDasClinicas } },
			);

			const idsDosEnderecos = clínicasParaDeletar.map(clinica =>
				clinica.endereco.toString(),
			);
			await EnderecoService.deletarEnderecosAssociadosAUnidadesDeSaude(
				idsDosEnderecos,
			);

			await this.model.deleteMany({ _id: { $in: objectIdArray } });
		} catch (error) {
			throw new Error('Erro ao Deletar as Clínicas por IDs!' + error);
		}
	}
	public async aprovarClinica(clinicaId: string): Promise<IClinica | null> {
		try {
			const clinicaExistente = await this.model.findById(clinicaId);

			if (!clinicaExistente) {
				throw new Error('Clínica não encontrada para atualização');
			}

			clinicaExistente.aprovado = true;

			const atualizarClinica = await clinicaExistente.save();

			if (atualizarClinica === null) {
				throw new Error('Clínica não encontrada para atualização');
			}

			return atualizarClinica;
		} catch (error) {
			throw new Error('Erro ao Atualizar a Clínica!' + error);
		}
	}
}
export default new ClinicaService();
