import IEndereco from '../../models/interfaces/IEndereco';

interface IEnderecoRepository {
	pegarEnderecos(): Promise<IEndereco[]>;
}
export default IEnderecoRepository;
