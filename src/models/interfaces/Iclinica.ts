import { Document, Schema } from 'mongoose';
import Iespecialidade from './Iespecialidades';
interface Iclinica extends Document {
  nome: string;
  imagem: string;
  horarioSemana: {
    open: string;
    close: string;
  };
  Sabado: {
    open: string;
    close: string;
  };
  longitude: number;
  latitude: number;
  especialidades: Iespecialidade[];
  endereco: Schema.Types.ObjectId;
  instagram: string;
  email: string;
  whatsapp: string;
  descricao: string;
}

export default Iclinica;
