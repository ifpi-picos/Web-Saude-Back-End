import { validationResult, body } from 'express-validator';
import Iusuario from '../models/interfaces/IUsuario';
import AuthService from './auth.service';
import IusuarioService from './interfaces/Iusuario.service';
import Usuario from '../models/Usuario';

class UsuarioService implements IusuarioService {
  public async salvarUsuario(
    nome: string,
    email: string,
    senha: string,
  ): Promise<Iusuario> {
    try {
      // Validações de entrada usando o Express Validator
      const errors = validationResult({
        body: {
          nome,
          email,
          senha,
        },
      });

      // Validações adicionais usando o Express Validator
      body('nome').notEmpty().withMessage('O nome é obrigatório');

      body('email').isEmail().withMessage('O e-mail não é válido');

      body('senha')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter pelo menos 6 caracteres');

      if (!errors.isEmpty()) {
        throw new Error('Erros de validação');
      }

      // Resto do seu código para salvar o usuário
      const existingUser = await Usuario.findOne({ email });
      if (existingUser) {
        throw new Error('O e-mail já está cadastrado');
      }

      const hashedPassword = await AuthService.hashPassword(senha);

      const newUser = await Usuario.create({
        nome,
        email,
        senha: hashedPassword,
      });

      return newUser;
    } catch (error) {
      throw new Error('Erro ao salvar o usuário');
    }
  }

  public async autenticarUsuario(
    email: string,
    senha: string,
  ): Promise<string> {
    try {
      // Validações de entrada usando o Express Validator
      const errors = validationResult({
        body: {
          email,
          senha,
        },
      });

      // Validações adicionais usando o Express Validator
      body('email').isEmail().withMessage('O e-mail não é válido');

      body('senha')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter pelo menos 6 caracteres');

      if (!errors.isEmpty()) {
        throw new Error('Erros de validação');
      }

      // Resto do seu código para autenticar o usuário
      const token = await AuthService.authenticateUser(email, senha);

      if (token) {
        return token;
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      throw new Error('Erro ao autenticar o usuário');
    }
  }

  public async alterarUsuario(
    id: string,
    nome: string,
    email: string,
    senha: string,
  ): Promise<Iusuario> {
    try {
      // Validações de entrada usando o Express Validator
      const errors = validationResult({
        body: {
          nome,
          email,
          senha,
        },
      });

      // Validações adicionais usando o Express Validator
      body('nome').notEmpty().withMessage('O nome é obrigatório');

      body('email').isEmail().withMessage('O e-mail não é válido');

      body('senha')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter pelo menos 6 caracteres');

      if (!errors.isEmpty()) {
        throw new Error('Erros de validação');
      }

      // Resto do seu código para alterar o usuário
      const user = await Usuario.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      user.nome = nome;
      user.email = email;

      if (senha) {
        const hashedPassword = await AuthService.hashPassword(senha);
        user.senha = hashedPassword;
      }

      await user.save();

      return user;
    } catch (error) {
      throw new Error('Erro ao alterar o usuário');
    }
  }

  public async alterarSenhaUsuario(id: string, senha: string): Promise<void> {
    try {
      // Validações de entrada usando o Express Validator
      const errors = validationResult({
        body: {
          senha,
        },
      });

      // Validações adicionais usando o Express Validator
      body('senha')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter pelo menos 6 caracteres');

      if (!errors.isEmpty()) {
        throw new Error('Erros de validação');
      }

      // Resto do seu código para alterar a senha do usuário
      const user = await Usuario.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const hashedPassword = await AuthService.hashPassword(senha);
      user.senha = hashedPassword;

      await user.save();
    } catch (error) {
      throw new Error('Erro ao alterar a senha do usuário');
    }
  }

  public async deletarUsuario(id: string): Promise<void> {
    try {
      // Validações de entrada usando o Express Validator
      const errors = validationResult({
        body: {},
      });

      if (!errors.isEmpty()) {
        throw new Error('Erros de validação');
      }

      // Resto do seu código para deletar o usuário
      await Usuario.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Erro ao deletar o usuário');
    }
  }

  public async deletarTodosUsuarios(): Promise<void> {
    try {
      // Validações de entrada usando o Express Validator
      const errors = validationResult({
        body: {},
      });

      if (!errors.isEmpty()) {
        throw new Error('Erros de validação');
      }

      // Resto do seu código para deletar todos os usuários
      await Usuario.deleteMany({});
    } catch (error) {
      throw new Error('Erro ao deletar todos os usuários');
    }
  }
}

export default new UsuarioService();
