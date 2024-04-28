import mongoose, { Connection } from 'mongoose';

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;

export const connectToDatabase = async () => {
	try {
		mongoose
			.connect(
				`mongodb+srv://${mongoUser}:${mongoPassword}${mongoHost}/?retryWrites=true&w=majority`,
				{},
			)
			.then(() => {
				console.log('conectado ao banco!');
			});
	} catch (error) {
		console.error('Erro ao conectar ao banco de dados:', error);
		throw error;
	}
};
