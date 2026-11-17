/*
A continuación se muestra el código completo 
para el archivo de rutas src/routes/especie.router.js, integrando los controladores,
 las reglas de validación con express-validator y los controles de seguridad 
 y roles (JWT y restricciones de administrador para las bajas).
*/
import { Router } from 'express';
import { 
    createEspecie, 
    getEspecies, 
    updateEspecie, 
    deleteEspecie 
} from '../controllers/especie.controller.js';
import { validateEspecie } from '../middlewares/especie.validator.js';
import { verificarToken, esAdministrador } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   GET /api/especies
 * @desc    Consultar especies (permite filtrar opcionalmente por código o nombre vulgar con ?q=...)
 * @access  Público / General
 */
router.get('/', getEspecies);

/**
 * @route   POST /api/especies
 * @desc    Crear una nueva especie
 * @access  Privado (Requiere token de sesión)
 */
router.post('/', verificarToken, validateEspecie, createEspecie);

/**
 * @route   PUT /api/especies/:codigo
 * @desc    Modificar todos los datos de la especie excepto su código (Búsqueda por código en parámetro)
 * @access  Privado (Requiere token de sesión)
 */
router.put('/:codigo', verificarToken, validateEspecie, updateEspecie);

/**
 * @route   DELETE /api/especies/:codigo
 * @desc    Eliminar una especie (Valida que no existan animales asociados y solo permitido para administradores)
 * @access  Privado (Administrador)
 */
router.delete('/:codigo', verificarToken, esAdministrador, deleteEspecie);

export default router;

