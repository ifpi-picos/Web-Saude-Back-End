import { Notificacoes } from '../models/Notificacoes';
import { Usuario } from '../models/Usuario';
import { AppDataSource } from '../database/db';

class NotificacoesService {
    private notificacoesRepository = AppDataSource.getRepository(Notificacoes);
    private usuarioRepository = AppDataSource.getRepository(Usuario);

    public async criarNotificacao(usuarioId: number, tipo: string, mensagem: string): Promise<Notificacoes> {
        try {
            const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId }, relations: ['notificacoes'] });

            if (!usuario) {
                throw new Error('Usuário não encontrado!');
            }

            const novaNotificacao = this.notificacoesRepository.create({
                tipo,
                mensagem,
                dataCriacao: new Date(),
                lida: false,
                usuario
            });

            await this.notificacoesRepository.save(novaNotificacao);

            usuario.notificacoes.push(novaNotificacao);
            await this.usuarioRepository.save(usuario);

            return novaNotificacao;
        } catch (error) {
            throw new Error('Erro ao criar notificação: ' + error);
        }
    }

    public async marcarNotificacaoComoLida(notificacaoId: number): Promise<Notificacoes | null> {
        try {
            const notificacao = await this.notificacoesRepository.findOne({ where: { id: notificacaoId } });

            if (!notificacao) {
                throw new Error('Notificação não encontrada!');
            }

            notificacao.lida = true;

            await this.notificacoesRepository.save(notificacao);

            return notificacao;
        } catch (error) {
            throw new Error('Erro ao marcar notificação como lida: ' + error);
        }
    }

    public async listarNotificacoes(): Promise<Notificacoes[]> {
        try {
            const notificacoesNaoLidas = await this.notificacoesRepository.find({
                where: {
                },relations:['usuario','usuario.unidadesSaude']
            });

            return notificacoesNaoLidas;
        } catch (error) {
            throw new Error('Erro ao listar notificações não lidas: ' + error);
        }
    }

    public async contarNotificacoesNaoLidas(): Promise<number> {
        try {
            const totalNaoLidas = await this.notificacoesRepository.count({
                where: {
                    lida: false
                }
            });

            return totalNaoLidas;
        } catch (error) {
            throw new Error('Erro ao contar notificações não lidas: ' + error);
        }
    }
    public async marcarTodasComoLidas(): Promise<void> {
        try {
            await this.notificacoesRepository.update({}, { lida: true });
        } catch (error) {
            throw new Error('Erro ao marcar todas as notificações como lidas: ' + error);
        }
    }

}

export default new NotificacoesService();
