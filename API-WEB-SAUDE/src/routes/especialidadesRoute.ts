import { Request, Response, Router } from 'express';
import EspecialidadesService from '../services/EspecialidadesService';
import EspecialidadesRepository from '../repositorys/EspecialidadesRepository';

const especialidadesRouter = Router();
// cadastrar especialidades
especialidadesRouter.post(
  '/nova-especialidade',
  async (req: Request, res: Response) => {
    try {
      const novaEspecialidade = await EspecialidadesService.novaEspecailidade(
        req.body,
      );
      return res.status(201).json({
        Message: 'Especialidade salva com Sucesso!',
        data: novaEspecialidade,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
);

// listar especialidades
especialidadesRouter.get(
  '/especialidades',
  async (req: Request, res: Response) => {
    try {
      const especialidades =
        await EspecialidadesRepository.pegarEspecialidades();
      return res.status(201).json(especialidades);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
);

// filtrar Especialidade
especialidadesRouter.get(
  '/especialidade/:nome',
  async (req: Request, res: Response) => {
    try {
      const { nome } = req.params;
      const especialidade = await EspecialidadesRepository.pegarEspecialidade(
        nome,
      );
      if (especialidade) {
        return res.json(especialidade);
      } else {
        return res
          .status(404)
          .json({ message: 'Especialidade não Encontrada!' });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
);
export default especialidadesRouter;
