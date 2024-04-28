import { Router,Request,Response } from 'express';
import UnidadeDeSaudeRouter from './unidadeDeSaudeRoute';
import EspecialidadRrouter from './especialidadeRoute';

const router = Router();

router.use('/', EspecialidadRrouter);
router.use('/',UnidadeDeSaudeRouter)
export default router;
 