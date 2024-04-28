import IHospital from '../../models/interfaces/IHospital';
interface IHospitalService {
	novoHospital(hospitalData: IHospital): Promise<IHospital | null>;
	alterarHospital(
		hospitalId: string,
		hospitalData: IHospital,
	): Promise<IHospital | null>;
	deletarHospital(hospitalId: string): Promise<IHospital | null>;
	deletarHospitaisDoUsuario(ids: string[]): Promise<void>;
	aprovarHospital(hospitalId: string): Promise<IHospital | null>;
}

export default IHospitalService;
