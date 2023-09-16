import IEndereco from '../../models/interfaces/IEndereco';

interface IEnderecoService {
	cadastrarEndereco(enderecoData: IEndereco): Promise<IEndereco | null>;
	alterarEndereco(
		id: string,
		enderecoData: IEndereco,
	): Promise<IEndereco | null>;
	deletarEndereco(id: string): Promise<void>;
	deletarTodosEnderecos(): Promise<void>;
}

export default IEnderecoService;
