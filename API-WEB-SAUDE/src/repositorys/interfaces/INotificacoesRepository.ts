import INotificacoes from "../../models/interfaces/INotificacoes";

interface INotificacoesRepository{
    pegarNotificacoes():Promise<INotificacoes[]>
}

export default INotificacoesRepository