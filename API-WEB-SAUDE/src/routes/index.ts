import { Router,Request,Response } from 'express';
import UnidadeDeSaudeRouter from './unidadeDeSaudeRoute';
import EspecialidadRrouter from './especialidadeRoute';
import usuarioRouter from './usuarioRoute';
import notificacoesRouter from './notificacaoRoute';

const router = Router();

router.use('/', EspecialidadRrouter);
router.use('/',UnidadeDeSaudeRouter);
router.use('/',usuarioRouter);
router.use('/',notificacoesRouter)
router.use('/',async(req:Request,res:Response)=>{
    res.send('<h1>App Online!</h1> <p> Link da Documentação <a href="/api-docs">/api-docs</a> </p>')
})
export default router;
 