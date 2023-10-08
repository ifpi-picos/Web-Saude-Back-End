import IClinica from '../../models/interfaces/IClinica';
import IHospital from '../../models/interfaces/IHospital';

interface IFiltroRepository {
	filtrar(
		nome: string,
	): Promise<IClinica[] | IHospital[] | (IClinica | IHospital)[] | null>;
}
export default IFiltroRepository;
