import Iendereco from '../../models/interfaces/Iendereco';

interface IEnderecoService {
  cadastrarEndereco(
    cep: string,
    rua: string,
    numero: number,
    bairro: string,
    cidade: string,
    uf: string,
  ): Promise<Iendereco>;
  alterarEndereco(id: string, novoEndereco: any): Promise<Iendereco | null>;
  deletarEndereco(id: string): Promise<void>;
  deletarTodosEnderecos(): Promise<void>;
}

export default IEnderecoService;
