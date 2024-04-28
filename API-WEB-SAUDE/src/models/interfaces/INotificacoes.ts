import { Document } from 'mongoose';

interface INotificacoes extends Document {
	tipo: string;
	mensagem: string;
	dataCriacao: Date;
	lida: boolean;
}

export default INotificacoes;
