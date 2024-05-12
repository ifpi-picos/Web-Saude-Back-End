import AuthService from './AuthService';
import { Usuario } from '../models/Usuario';
import { AppDataSource } from '../database/db';
import { UnidadeDeSaude } from '../models/UnidadeDeSaude';

class UsuarioService {
    private usuarioRepository = AppDataSource.getRepository(Usuario);
    private unidadeDeSaudeRepository = AppDataSource.getRepository(UnidadeDeSaude);

    public async salvarUsuario(nome: string, email: string, senha: string, tipo: string): Promise<Usuario | null> {
        try {
            const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });

            if (usuarioExistente?.email === email) {
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
            throw new Error('Erro ao salvar o usuário!' + error);
        }
    }

    public async autenticarUsuario(email: string, senha: string): Promise<{ token: string, Id: string, tipo: string } | null> {
        try {
            const result = await AuthService.authenticateUser(email, senha);
            console.log(result?.tipo)
            return result;
        } catch (error) {
            throw new Error('Erro ao autenticar o usuário!' + error);
        }
    }
    
    public async alterarUsuario(id: number, nome: string, email: string, senha: string, tipo: string): Promise<Usuario | null> {
        try {
            const usuario = await this.usuarioRepository.findOne({ where: { id } });
    
            if (!usuario) {
                throw new Error('Usuário não encontrado!');
            }
    
            if (email !== usuario.email) {
                const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });
    
                if (usuarioExistente) {
                    return null; 
                }
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
            throw new Error('Erro ao alterar o usuário!' + error);
        }
    }
    public async alterarSenhaUsuario(id: number, senha: string): Promise<Usuario | null> {
        try {
            const usuario = await this.usuarioRepository.findOne({ where: { id } });
    
            if (!usuario) {
                throw new Error('Usuário não encontrado!');
            }
    
            const hashedPassword = await AuthService.hashPassword(senha);
            usuario.senha = hashedPassword;
    
            await this.usuarioRepository.save(usuario);
    
            return usuario;
        } catch (error) {
            throw new Error('Erro ao alterar a senha do usuário!' + error);
        }
    }
    
    public async deletarUsuario(id: number): Promise<Usuario | null> {
        try {
            const usuarioDeletado = await this.usuarioRepository.findOne({ where: { id } });
            if (!usuarioDeletado) {
                return null;
            }
            await this.usuarioRepository.remove(usuarioDeletado); 
            return usuarioDeletado;
        } catch (error) {
            throw new Error('Erro ao deletar o usuário!' + error);
        }
    }
    

    public async adicionarUnidadeDeSaudeAoUsuario(usuarioId: number, unidadeDeSaudeId: number): Promise<Usuario | null> {
        try {
            const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
    
            const unidadeDeSaude = await this.unidadeDeSaudeRepository.findOne({ where: { id: unidadeDeSaudeId } });

            if (!unidadeDeSaude) {
                throw new Error(`Unidade de saúde com o ID ${unidadeDeSaudeId} não encontrada`);
            }
    
            usuario.unidadesSaude?.push(unidadeDeSaude);
    
            await this.usuarioRepository.save(usuario);
            return usuario;
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
            throw new Error('Erro ao listar usuários: ' + error);
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
            const unidadeDeSaude = await this.unidadeDeSaudeRepository.findOne({ where: { id: unidadeDeSaudeId } });

            if (!unidadeDeSaude) {
                throw new Error('Unidade de saúde não encontrada.');
            }

            unidadeDeSaude.aprovado = true;

            await AppDataSource.getRepository(UnidadeDeSaude).save(unidadeDeSaude);

            return unidadeDeSaude;
        } catch (error) {
            throw new Error('Erro ao aprovar unidade de saúde.' + error);
        }
    }

    public async listarUnidadesDeSaudePendentes(): Promise<UnidadeDeSaude[]> {
        try {
            const unidadesDeSaudePendentes = await AppDataSource.getRepository(UnidadeDeSaude).find({
                where: { aprovado: false }, relations: ['endereco','especialidades']
            });

            return unidadesDeSaudePendentes;
        } catch (error) {
            throw new Error('Erro ao listar unidades de saúde pendentes.' + error);
        }
    }

    public async alterarStatusUsuario(id: number, novoStatus: boolean): Promise<Usuario | null> {
        try {
            const usuario = await this.usuarioRepository.findOne({ where: { id } });
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            
            usuario.status = novoStatus;
            
            await this.usuarioRepository.save(usuario);
            
            return usuario;
        } catch (error) {
            throw new Error('Erro ao alterar o status do usuário: ' + error);
        }
    }

    public async listarUsuariosAtivos(): Promise<Usuario[]> {
        try {
            const usuariosAtivos = await this.usuarioRepository.find({ where: { status: true } });
            return usuariosAtivos;
        } catch (error) {
            throw new Error('Erro ao listar usuários ativos: ' + error);
        }
    }
    public async contarTotalUsuariosEUnidadesDeSaude(): Promise<{ totalUsuarios: number, totalUnidadesDeSaude: number }> {
        try {
            const totalUsuarios = await this.usuarioRepository.count();
            const totalUnidadesDeSaude = await this.unidadeDeSaudeRepository.count();
            
            return { totalUsuarios, totalUnidadesDeSaude };
        } catch (error) {
            throw new Error('Erro ao contar total de usuários e unidades de saúde: ' + error);
        }
    }
    
}

export default new UsuarioService();
