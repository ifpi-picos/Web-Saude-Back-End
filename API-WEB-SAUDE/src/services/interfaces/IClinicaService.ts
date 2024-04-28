import IClinica from '../../models/interfaces/IClinica';
import { ClientSession } from 'mongoose';

interface IClinicaService {
	novaClinica(
		clinicaData: IClinica,
		session: ClientSession,
	): Promise<IClinica | null>;
	alterarClinica(
		clinicaId: string,
		clinicaData: IClinica,
		session: ClientSession,
	): Promise<IClinica | null>;
	deletarClinica(
		clinicaId: string,
		session: ClientSession,
	): Promise<IClinica | null>;
	deletarClinicasDoUsuario(ids: string[]): Promise<void>;
	aprovarClinica(clinicaId: string): Promise<IClinica | null>;
}

export default IClinicaService;
