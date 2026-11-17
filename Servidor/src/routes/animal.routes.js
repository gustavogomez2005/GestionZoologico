/*
Aplicando las reglas solicitadas
 (por ejemplo, asegurando que las operaciones críticas de borrado 
 o modificación solo las ejecute un administrador, 
 mientras que las consultas puedan ser públicas o generales):
*/

import { Router } from 'express';
import { 
    createAnimal, 
    getAnimales, 
    updateAnimal, 
    deleteAnimal 
} from '../controllers/animal.controller.js';
import { validateAnimal } from '../middlewares/animal.validator.js';
import { verificarToken, esAdministrador } from '../middlewares/auth.middleware.js';

const router = Router();

// Consultas libres o protegidas según el requerimiento
router.get('/', getAnimales);

// Altas (Requiere autenticación)
router.post('/', verificarToken, validateAnimal, createAnimal);

// Modificaciones (Requiere autenticación)
router.put('/:codigo', verificarToken, validateAnimal, updateAnimal);

// Bajas: Solamente las puede realizar el Administrador
router.delete('/:codigo', verificarToken, esAdministrador, deleteAnimal);

export default router;
