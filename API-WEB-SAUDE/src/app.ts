import Express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import router from './routes';
import dotenv from 'dotenv';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import swaggerDocs from './swagger.json';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middlewares/auth';

export class App {
	private express = Express.application;
	private porta: number = 5000;

	constructor() {
		dotenv.config();
		this.express = Express();
		this.listen();
		this.database();
		this.middlewares();
		this.rotas();
	}
	private listen(): void {
		this.express.listen(this.porta, () => {
			console.log(`servidor rodando na porta: ${this.porta}`);
		});
	}
	private middlewares(): void {
		this.express.use(morgan('combined'));
		this.express.use(cookieParser());
		this.express.use(helmet());
		this.express.use(Express.json());
		this.express.use(cors());
		this.express.use(compression());
		this.express.use(bodyParser.json());
		this.express.use(
			'/api-docs',
			swaggerUI.serve,
			swaggerUI.setup(swaggerDocs),
		);
	}
	private database(): void {
		const mongoUser = process.env.MONGO_USER;
		const mongoPassword = process.env.MONGO_PASSWORD;
		const mongoHost = process.env.MONGO_HOST;
		mongoose
			.connect(
				`mongodb+srv://${mongoUser}:${mongoPassword}${mongoHost}/?retryWrites=true&w=majority`,
				{},
			)
			.then(() => {
				console.log('conectado ao banco!');
			})
			.catch(err => {
				console.log('erro ao se conectar ao banco ' + err);
			});
	}
	private rotas() {
		this.express.all('*',authMiddleware)
		this.express.use('/', router);
	}
}
