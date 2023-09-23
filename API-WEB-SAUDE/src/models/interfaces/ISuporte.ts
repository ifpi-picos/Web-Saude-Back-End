import { Document } from 'mongoose';

interface ISuporte extends Document {
	nome: string;
	email: string;
	mensagem: string;
}

export default ISuporte;
