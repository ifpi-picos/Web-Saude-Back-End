import IClinica from '@src/models/interfaces/IClinica';
interface IClinicaService {
	novaClinica(clinicaData: IClinica): Promise<IClinica | null>;
	alterarClinica(
		clinicaId: string,
		clinicaData: IClinica,
	): Promise<IClinica | null>;
	deletarClinica(clinicaId: string): Promise<IClinica | null>;
}

export default IClinicaService;
