import { Model, Types } from 'mongoose';
import IHospitalService from './interfaces/IHospitalService';
import IHospital from '../models/interfaces/IHospital';
import Hospital from '../models/Hospital';
import Especialidades from '../models/Especialidades';
import EnderecoService from './EnderecoService';
import HospitalRepository from '../repositorys/HospitalRepository';
class HospitalService implements IHospitalService {
	private model: Model<IHospital>;

	constructor() {
		this.model = Hospital;
	}
	public async novoHospital(
		hospitalData: IHospital,
	): Promise<IHospital | null> {
		try {
			const hospitalExistente = await HospitalRepository.pegarHospital(
				hospitalData.nome,
			);
			if (hospitalExistente) {
				return null;
			}
			const novoHospital = await this.model.create(hospitalData);
			return novoHospital;
		} catch (error) {
			throw new Error('Erro ao Salvar o Hospital!' + error);
		}
	}
	public async alterarHospital(
		hospitalId: string,
		hospitalData: IHospital,
	): Promise<IHospital | null> {
		try {
			const hospitalExistente = await this.model.findById(hospitalId);

			if (!hospitalExistente) {
				throw new Error('Hospital não encontrado para atualização');
			}

			if (hospitalData.nome !== hospitalExistente.nome) {
				const hospitalComMesmoNome = await HospitalRepository.pegarHospital(
					hospitalData.nome,
				);

				if (hospitalComMesmoNome) {
					return null;
				}
			}
			const atualizarHospital = await this.model.findByIdAndUpdate(
				hospitalId,
				hospitalData,
				{ new: true },
			);

			if (atualizarHospital === null) {
				throw new Error('Hospital não encontrado para atualização');
			}

			return atualizarHospital;
		} catch (error) {
			throw new Error('Erro ao Atualizar o Hospital!' + error);
		}
	}

	public async deletarHospital(hospitalId: string): Promise<IHospital | null> {
		try {
			return await this.model.findByIdAndDelete(hospitalId);
		} catch (error) {
			throw new Error('Erro ao Deletar o Hospital!' + error);
		}
	}

	public async obterHospitalPorId(id: string) {
		try {
			const hospital = await this.model.findOne({ _id: id });

			return hospital;
		} catch (error) {
			throw new Error('Erro ao buscar hospital por ID: ' + error);
		}
	}
	public async deletarHospitaisDoUsuario(ids: string[]): Promise<void> {
		try {
			const objectIdArray = ids.map(id => new Types.ObjectId(id));

			const hospitaisParaDeletar = await this.model.find({
				_id: { $in: objectIdArray },
			});

			const idsDosHospitais = hospitaisParaDeletar.map(hospital =>
				hospital._id.toString(),
			);

			await Especialidades.updateMany(
				{ hospitais: { $in: idsDosHospitais } },
				{ $pullAll: { hospitais: idsDosHospitais } },
			);

			const idsDosEnderecos = hospitaisParaDeletar.map(hospital =>
				hospital.endereco.toString(),
			);
			await EnderecoService.deletarEnderecosAssociadosAUnidadesDeSaude(
				idsDosEnderecos,
			);

			await this.model.deleteMany({ _id: { $in: objectIdArray } });
		} catch (error) {
			throw new Error('Erro ao Deletar os Hospitais por IDs!' + error);
		}
	}

	public async aprovarHospital(hospitalId: string): Promise<IHospital | null> {
		try {
			const hospitalExistente = await this.model.findById(hospitalId);

			if (!hospitalExistente) {
				throw new Error('Hospital não encontrado para atualização');
			}

			hospitalExistente.aprovado = true;

			const atualizarHospital = await hospitalExistente.save();

			if (atualizarHospital === null) {
				throw new Error('Hospital não encontrado para atualização');
			}

			return atualizarHospital;
		} catch (error) {
			throw new Error('Erro ao Atualizar o Hospital!' + error);
		}
	}
}
export default new HospitalService();
