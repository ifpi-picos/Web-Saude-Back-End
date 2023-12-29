import { Model } from "mongoose";
import INotificacoesService from "./interfaces/INotificacoesService";
import INotificacoes from "../models/interfaces/INotificacoes";
import Notificacoes from "../models/Notificacoes";

class NotificacoesService implements INotificacoesService {
  private notificacoes:Model<INotificacoes>

  constructor(){
    this.notificacoes = Notificacoes
  }
  public async novaNotificacao(tipo: string, mensagem: string): Promise<INotificacoes | null> {
    try {
      return await this.notificacoes.create({ tipo, mensagem });
    } catch (error) {
      throw new Error("Erro ao enviar notificação!");
    }
  }
}

export default new NotificacoesService()