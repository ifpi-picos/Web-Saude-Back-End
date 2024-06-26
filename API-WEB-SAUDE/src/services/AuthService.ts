import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database/db';
import { Usuario } from '../models/Usuario';

export interface JwtToken {
    sub: string;
    userType: string;
}

export default class AuthService {
    public static async hashPassword(
        password: string,
        saltRounds = 10,
    ): Promise<string> {
        return await bcrypt.hash(password, saltRounds);
    }

    public static async comparePasswords(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public static generateToken(sub: string, userType: string): string {
        const key = process.env.JWT_SECRET || '';

        const signOptions: jwt.SignOptions = {
            expiresIn: '1h',
            algorithm: 'HS256',
        };

        return jwt.sign({ sub, userType }, key, signOptions);
    }

    public static decodeToken(token: string): JwtToken {
        const key = process.env.JWT_SECRET || ''; 

        try {
            const decodedToken = jwt.verify(token, key) as JwtToken;
            return decodedToken;
        } catch (error) {
            throw new Error('Erro ao decodificar o token');
        }
    }

    public static async authenticateUser(
        email: string,
        senha: string,
    ): Promise<{ token: string; Id: string,tipo:string } | null> {
        try {
            const usuarioRepository = AppDataSource.getRepository(Usuario);
            const user = await usuarioRepository.findOne({ where: { email } });

            if (!user) {
                return null;
            }

            const isPasswordValid = await this.comparePasswords(
                senha,
                user.senha,
            );

            if (!isPasswordValid) {
                return null;
            }

            const token = this.generateToken(user.id.toString(), user.tipo || '');
            return { token, Id: user.id.toString(),tipo:user.tipo };

        } catch (error) {
            throw new Error('Erro ao autenticar o usuário');
        }
    }
}
