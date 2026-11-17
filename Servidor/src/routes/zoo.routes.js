import { Router } from 'express';
import { createZoo, getZoos, updateZoo, deleteZoo } from '../controllers/zoo.controller.js';
import { validateZoo } from '../middlewares/zoo.validator.js';
import { verificarToken, esAdministrador } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getZoos);
router.post('/', verificarToken, esAdministrador, validateZoo, createZoo);
router.put('/:codigo', verificarToken, esAdministrador, validateZoo, updateZoo);
router.delete('/:codigo', verificarToken, esAdministrador, deleteZoo);

export default router;
