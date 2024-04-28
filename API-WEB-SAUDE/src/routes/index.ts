import { Router, Request, Response } from 'express';
import clinicaRouter from './clinicaRoute';
import usuarioRouter from './usuarioRoute';
import especialidadesRouter from './especialidadesRoute';
import hospitalRouter from './hospitalRoute';
import filtroRouter from './consultasRoute';
/*import suporteRoute from './suporteRoute';*/

const router = Router();

router.use('/', usuarioRouter);
router.use('/', clinicaRouter);
router.use('/', especialidadesRouter);
router.use('/', hospitalRouter);
router.use('/', filtroRouter);
router.use('/', async (req: Request, res: Response) => {
	res.send(
		'<h1>App Online!</h1> <p> Link da Documentação <a href="/api-docs">/api-docs</a> </p>',
	);
});
/*router.use('/', suporteRoute);*/

export default router;
