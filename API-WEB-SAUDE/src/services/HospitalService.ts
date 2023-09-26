import { Model } from 'mongoose';
import IHospitalService from './interfaces/IHospitalService';
import IHospital from '../models/interfaces/IHospital';
import Hospital from '../models/Hospital';
import HospitalRepository from '../repositorys/HospitalRepository';

class HospitalService implements IHospitalService {
	private model: Model<IHospital>;

	constructor() {
		this.model = Hospital;
	}
	public async novoHospital(hospitalData: IHospital): Promise<IHospital | null> {
		try {
			const hospitalExistente = await HospitalRepository.pegarHospital(
				hospitalData.nome,
			);
			if (hospitalExistente) {
				return null;
			}
			const novoHospital = this.model.create(hospitalData);
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
			const hospitalExistente = await HospitalRepository.pegarHospital(
				hospitalData.nome,
			);
			if (hospitalExistente) {
				return null;
			}
			const atualizarHospital = await this.model.findByIdAndUpdate(
				hospitalId,
				hospitalData,
				{ new: true },
			);

			return atualizarHospital;
		} catch (error) {
			throw new Error('Erro ao Atualizar o Hospital!' + error);
		}
	}
	public async deletarHospital(hospitalId: string): Promise<void> {
		try {
			await this.model.findByIdAndDelete(hospitalId);
		} catch (error) {
			throw new Error('Erro ao Deletar o Hospital!' + error);
		}
	}
	public async deletarTodosHospitais(): Promise<void> {
		try {
			await this.model.deleteMany({});
		} catch (error) {
			throw new Error('Errro ao Deletar todos os Hospitais!' + error);
		}
	}
}
export default new HospitalService();
