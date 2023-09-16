import { Router } from 'express';
import clinicaRouter from './clinicaRoute';
import usuarioRouter from './usuarioRoute';
import enderecoRoute from './enderecoRoute';
import especialidadesRouter from './especialidadesRoute';
import hospitalRouter from './hospitalRoute';

const router = Router();

router.use('/', usuarioRouter);
router.use('/', clinicaRouter);
router.use('/', enderecoRoute);
router.use('/', especialidadesRouter);
router.use('/', hospitalRouter);

export default router;
