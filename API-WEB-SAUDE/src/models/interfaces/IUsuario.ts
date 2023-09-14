import { Document } from 'mongoose';

interface Iusuario extends Document {
  nome: string;
  email: string;
  senha: string;
}

export default Iusuario;
