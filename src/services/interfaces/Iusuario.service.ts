import IUsuario from '../../models/interfaces/IUsuario';

interface IusuarioService {
  salvarUsuario(
    nome: string,
    email: string,
    senha: string,
    senah: string,
  ): Promise<IUsuario>;
  autenticarUsuario(email: string, senha: string): Promise<string>;
  alterarUsuario(
    id: string,
    nome: string,
    email: string,
    senha: string,
  ): Promise<IUsuario>;
  alterarSenhaUsuario(id: string, senha: string): Promise<void>;
  deletarUsuario(id: string): Promise<void>;
  deletarTodosUsuarios(): Promise<void>;
}

export default IusuarioService;
