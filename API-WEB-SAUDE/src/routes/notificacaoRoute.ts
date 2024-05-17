import express, { Request, Response } from 'express';
import NotificacoesService from '../services/NotificacoesService';

const notificacoesRouter = express.Router();


notificacoesRouter.put('/notificacoes/marcar-lida/:id', async (req: Request, res: Response) => {
    try {
        const notificacaoId = parseInt(req.params.id);
        const notificacao = await NotificacoesService.marcarNotificacaoComoLida(notificacaoId);
        if (notificacao) {
            return res.json(notificacao);
        } else {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

notificacoesRouter.get('/notificacoes', async (req: Request, res: Response) => {
    try {
        const notificacoes = await NotificacoesService.listarNotificacoes();
        return res.json(notificacoes);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

notificacoesRouter.get('/notificacoes/total-nao-lidas', async (req: Request, res: Response) => {
    try {
        const totalNaoLidas = await NotificacoesService.contarNotificacoesNaoLidas();
        return res.json({ totalNaoLidas });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});
notificacoesRouter.put('/notificacoes/marcar-todas-lidas', async (req: Request, res: Response) => {
    try {
        await NotificacoesService.marcarTodasComoLidas();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});
export default notificacoesRouter;
