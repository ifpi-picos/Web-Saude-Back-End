import IEspecialidade from '../../models/interfaces/IEspecialidades';

interface IEspecialidadesRepositories {
	pegarEspecialidades(): Promise<IEspecialidade[]>;
	pegarEspecialidade(nome: string): Promise<IEspecialidade | null>;
	listarIdsDasEspecialidadesPorClinica(clinicaId: string): Promise<string[]>;
	listarIdsDasEspecialidadesPorHospital(hospitalId: string): Promise<string[]>;
}

export default IEspecialidadesRepositories;
