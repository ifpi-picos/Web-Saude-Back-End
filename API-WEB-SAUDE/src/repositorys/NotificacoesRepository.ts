import { Model } from "mongoose";
import INotificacoesRepository from "./interfaces/INotificacoesRepository";
import INotificacoes from "../models/interfaces/INotificacoes";
import Notificacoes from "../models/Notificacoes";

class NotificacoesRepository implements INotificacoesRepository{

    private notificacoes:Model<INotificacoes>

    constructor(){
        this.notificacoes = Notificacoes
    }

    public async pegarNotificacoes(): Promise<INotificacoes[]> {
        try {
            const notificacoes = await this.notificacoes.find();
            return notificacoes
        } catch (error) {
            throw new Error ('Erro ao pegar as notificações')
        }
    }
}

export default new NotificacoesRepository()