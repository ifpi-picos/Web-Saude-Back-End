import { Router } from 'express';
import clinicaRouter from './clinicaRoute';
import usuarioRouter from './usuarioRoute';
import especialidadesRouter from './especialidadesRoute';
import hospitalRouter from './hospitalRoute';
import filtroRouter from './filtroRoute';
/*import suporteRoute from './suporteRoute';*/

const router = Router();

router.use('/', usuarioRouter);
router.use('/', clinicaRouter);
router.use('/', especialidadesRouter);
router.use('/', hospitalRouter);
router.use('/', filtroRouter);
/*router.use('/', suporteRoute);*/

export default router;
