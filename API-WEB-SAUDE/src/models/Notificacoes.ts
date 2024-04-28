import { Schema, model } from 'mongoose';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import INotificacoes from './interfaces/INotificacoes';

const NotificacoesSchema = new Schema<INotificacoes>(
	{
		tipo: {
			type: String,
		},
		mensagem: {
			type: String,
		},
		lida: {
			type: Boolean,
			default: false,
		},
		dataCriacao: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: {
			getters: true,
			transform: function (doc, ret) {
				const formattedDate = format(doc.dataCriacao, 'dd/MM/yyyy HH:mm:ss', {
					locale: ptBR,
				});
				ret.dataCriacaoFormatada = formattedDate;
				delete ret._id;
				delete ret.__v;
				delete ret.dataCriacao;
				return ret;
			},
		},
	},
);

export default model<INotificacoes>('Notificacoes', NotificacoesSchema);
