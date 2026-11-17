/*
Valida el registro y el inicio de sesión, 
asegurando formatos correctos de correo, contraseñas seguras y campos obligatorios.
*/

import { body } from 'express-validator';
import { validateResult } from './validator.middleware.js';

export const validateRegister = [
    body('usuario')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es obligatorio.')
        .isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres.'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('email')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio.')
        .isEmail().withMessage('Formato de correo electrónico inválido.')
        .normalizeEmail(),
    body('telefono')
        .trim()
        .notEmpty().withMessage('El teléfono es obligatorio.')
        .isMobilePhone().withMessage('Formato de teléfono inválido.'),
    body('dni')
        .trim()
        .notEmpty().withMessage('El DNI es obligatorio.')
        .isNumeric().withMessage('El DNI debe contener solo números.'),
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo debe contener letras y espacios.'),
    body('apellido')
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio.')
        .matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo debe contener letras y espacios.'),
    validateResult
];

export const validateLogin = [
    body('credencial')
        .trim()
        .notEmpty().withMessage('Debe ingresar su usuario, email o teléfono.'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.'),
    validateResult
];

