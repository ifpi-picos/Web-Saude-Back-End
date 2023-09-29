import { Router } from 'express';
import clinicaRouter from './clinicaRoute';
import usuarioRouter from './usuarioRoute';
import enderecoRoute from './enderecoRoute';
import especialidadesRouter from './especialidadesRoute';
import hospitalRouter from './hospitalRoute';
import filtroRouter from './filtroRoute';

const router = Router();

router.use('/', usuarioRouter);
router.use('/', clinicaRouter);
router.use('/', enderecoRoute);
router.use('/', especialidadesRouter);
router.use('/', hospitalRouter);
router.use('/', filtroRouter);

export default router;
