import { Document } from 'mongoose';
interface IEndereco extends Document {
	cep: string;
	rua: string;
	numero: number;
	bairro: string;
	cidade: string;
	uf: string;
}

export default IEndereco;
