import { Schema, model, Document } from 'mongoose';
import IUsuario from './interfaces/IUsuario';

const usuarioModel = new Schema<IUsuario>({
  nome: {
    type: String,
  },
  email: {
    type: String,
  },
  senha: {
    type: String,
    required: true,
  },
});

export default model<IUsuario & Document>('Usuario', usuarioModel);
