import IEspecialidade from '@src/models/interfaces/IEspecialidades';

interface IEspecailidadesService {
	novaEspecailidade(
		especialidadeData: IEspecialidade,
	): Promise<IEspecialidade | null>;
	atualizarEspecailidade(
		especialidadeID: string,
		especialidadeData: IEspecialidade,
	): Promise<IEspecialidade | null>;
	deletarEspecialidade(especialidadeID: string): Promise<void>;
	deletarTodasEspecialidade(): Promise<void>;
}

export default IEspecailidadesService;
