import IUsuario from '../../models/interfaces/IUsuario';

interface IUsuarioRepository {
  listarUsuarios(): Promise<IUsuario[]>;
  pegarUsuario(id: string): Promise<void>;
  pegarEmail(email: string): Promise<void>;
}
export default IUsuarioRepository;
