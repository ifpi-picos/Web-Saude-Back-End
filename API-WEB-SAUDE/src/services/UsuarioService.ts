import AuthService from './AuthService';
import { Usuario } from '../models/Usuario';
import { AppDataSource } from '../database/db';
import { UnidadeDeSaude } from '../models/UnidadeDeSaude';
class UsuarioService{
    private usuarioRepository = AppDataSource.getRepository(Usuario);
    private unidadeDeSaudeRepository = AppDataSource.getRepository(UnidadeDeSaude);

    public async salvarUsuario(nome: string, email: string, senha: string, tipo: string): Promise<Usuario | null> {
        try {
            const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });

            if (usuarioExistente) {
                return null;
            }

            const hashedPassword = await AuthService.hashPassword(senha);

            const novoUsuario = this.usuarioRepository.create({
                nome,
                email,
                senha: hashedPassword,
                tipo,
            });

            await this.usuarioRepository.save(novoUsuario);

            return novoUsuario;
        } catch (error) {
            throw new Error('Erro ao Salvar o Usuário!' + error);
        }
    }

    public async autenticarUsuario(email: string, senha: string): Promise<string | null> {
        try {
            const token = await AuthService.authenticateUser(email, senha);

            if (token) {
                return token;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao Autenticar o Usuário!' + error);
        }
    }

    public async alterarUsuario(id: number, nome: string, email: string, senha: string, tipo: string): Promise<Usuario | null> {
        try {
            const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });

          
        if (usuarioExistente && usuarioExistente.id !== id) { 
            return null;
        }

            const usuario = await this.usuarioRepository.findOne({where:{id}});

            if (!usuario) {
                throw new Error('Usuário não Encontrado!');
            }

            usuario.nome = nome;
            usuario.email = email;
            usuario.tipo = tipo;

            if (senha) {
                const hashedPassword = await AuthService.hashPassword(senha);
                usuario.senha = hashedPassword;
            }

            await this.usuarioRepository.save(usuario);

            return usuario;
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao Alterar o Usuário!' + error);
        }
    }
    public async deletarUsuario(id: number): Promise<Usuario | null> {
        try {
            const usuarioDeletado = await this.usuarioRepository.findOne({ where: { id } });
            if (!usuarioDeletado) {
                return null;
            }
            await this.usuarioRepository.delete(id);
            return usuarioDeletado;
        } catch (error) {
            throw new Error('Erro ao Deletar o Usuário!' + error);
        }
    }
    public async adicionarUnidadeDeSaudeAoUsuario(usuarioId: number, unidadeDeSaudeId: number): Promise<Usuario | null> {
        try {
            const usuario = await this.usuarioRepository.findOne({where:{id:usuarioId}});
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
    
            const unidadeDeSaude = await this.unidadeDeSaudeRepository.findOne({ where: { id: unidadeDeSaudeId } });

            if (!unidadeDeSaude) {
                throw new Error(`Unidade de saúde com o ID ${unidadeDeSaudeId} não encontrada`);
            }
    
            
            usuario.unidadesSaude?.push(unidadeDeSaude);
    
             await this.usuarioRepository.save(usuario);
             return usuario
        } catch (error) {
            console.log(error);
            throw new Error('Erro ao adicionar unidade de saúde ao usuário: ' + error);
        }
    }
    
    public async listarUsuarios(): Promise<Usuario[]> {
        try {
            const usuarios = await this.usuarioRepository.find({ relations: ['unidadesSaude'] });
            return usuarios;
        } catch (error) {
            console.log(error);
            throw new Error('Erro ao listar usuários: ');
        }
    }
    public async listarUnidadesDeSaudeDoUsuario(usuarioId: number): Promise<UnidadeDeSaude[]> {
        try {
            const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId }, relations: ['unidadesSaude'] });
    
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
    
            return usuario.unidadesSaude || [];
        } catch (error) {
            console.log(error);
            throw new Error('Erro ao listar unidades de saúde do usuário: ' + error);
        }
    }
    public async aprovarUnidadeDeSaude(unidadeDeSaudeId: number): Promise<UnidadeDeSaude | null> {
        try {
            // Busca a unidade de saúde com base no ID fornecido
            const unidadeDeSaude = await this.unidadeDeSaudeRepository.findOne({where:{id:unidadeDeSaudeId}});

            if (!unidadeDeSaude) {
                throw new Error('Unidade de saúde não encontrada.');
            }

            unidadeDeSaude.aprovado = true;

            await AppDataSource.getRepository(UnidadeDeSaude).save(unidadeDeSaude);

            return unidadeDeSaude;
        } catch (error) {
            throw new Error('Erro ao aprovar unidade de saúde.');
        }
    }
    public async listarUnidadesDeSaudePendentes(): Promise<UnidadeDeSaude[]> {
        try {
            const unidadesDeSaudePendentes = await AppDataSource.getRepository(UnidadeDeSaude).find({
                where: { aprovado: false }
            });

            return unidadesDeSaudePendentes;
        } catch (error) {
            console.error('Erro ao listar unidades de saúde pendentes:', error);
            throw new Error('Erro ao listar unidades de saúde pendentes.');
        }
    }
}

export default new UsuarioService();
