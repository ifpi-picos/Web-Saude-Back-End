import IEspecialidade from '../../models/interfaces/IEspecialidades';

interface IEspecialidadesRepositories {
	pegarEspecialidades(): Promise<IEspecialidade[]>;
	pegarEspecialidade(nome: string): Promise<IEspecialidade | null>;
}

export default IEspecialidadesRepositories;
