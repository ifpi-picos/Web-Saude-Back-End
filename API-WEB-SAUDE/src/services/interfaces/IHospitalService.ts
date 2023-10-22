import IHospital from '@src/models/interfaces/IHospital';
interface IHospitalService {
	novoHospital(hospitalData: IHospital): Promise<IHospital | null>;
	alterarHospital(
		hospitalId: string,
		hospitalData: IHospital,
	): Promise<IHospital | null>;
	deletarHospital(hospitalId: string): Promise<IHospital | null>;
}

export default IHospitalService;
