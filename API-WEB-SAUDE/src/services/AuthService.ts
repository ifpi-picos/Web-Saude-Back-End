import bcrypt from 'bcrypt';
import config from 'config';
import jwt, { Secret } from 'jsonwebtoken';
import Usuario from '../models/Usuario';

export interface JwtToken {
  sub: string;
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

  public static generateToken(sub: string): string {
    const key = config.get('App.auth.key') as Secret;

    const signOptions: jwt.SignOptions = {
      expiresIn: '1h',
      algorithm: 'HS256',
    };

    return jwt.sign({ sub }, key, signOptions);
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, config.get('App.auth.key')) as JwtToken;
  }

  public static async authenticateUser(
    email: string,
    senha: string,
  ): Promise<string> {
    try {
      const user = await Usuario.findOne({ email });

      if (!user) {
        throw new Error('Usuário não encontrado!');
      }

      const isPasswordValid = await this.comparePasswords(senha, user.senha);

      if (!isPasswordValid) {
        throw new Error('Senha incorreta!');
      }

      const token = this.generateToken(user._id);
      return token;
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao autenticar o usuário');
    }
  }
}
