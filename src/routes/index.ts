import { Router } from 'express';
import clinicaRouter from './clinicaRoute';
import usuarioRouter from './usuarioRoute';
import enderecoRoute from './enderecoRoute';
import especialidadesRouter from './especialidadesRoute';

const router = Router();

router.use('/', usuarioRouter);
router.use('/', clinicaRouter);
router.use('/', enderecoRoute);
router.use('/', especialidadesRouter);

export default router;
