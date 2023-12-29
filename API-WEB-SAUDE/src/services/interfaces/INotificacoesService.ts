import INotificacoes from "../../models/interfaces/INotificacoes";

interface INotificacoesService {

    novaNotificacao(tipo: string, mensagem: string):Promise<INotificacoes | null>
    
}

export default INotificacoesService