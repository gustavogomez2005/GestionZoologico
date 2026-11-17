/*
Valida que el nombre científico, nombre vulgar y familia
 contengan solo letras/espacios, y 
 que el estado de peligro de extinción sea estrictamente booleano.
*/

import { body } from 'express-validator';
import { validateResult } from './validator.middleware.js';

const soloLetrasYEspacios = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

export const validateEspecie = [
    body('nombre_vulgar')
        .trim()
        .notEmpty().withMessage('El nombre vulgar es obligatorio.')
        .matches(soloLetrasYEspacios).withMessage('El nombre vulgar solo debe contener letras y espacios.'),
    body('nombre_cientifico')
        .trim()
        .notEmpty().withMessage('El nombre científico es obligatorio.')
        .matches(soloLetrasYEspacios).withMessage('El nombre científico solo debe contener letras y espacios.'),
    body('familia')
        .trim()
        .notEmpty().withMessage('La familia es obligatoria.')
        .matches(soloLetrasYEspacios).withMessage('La familia solo debe contener letras y espacios.'),
    body('peligro_extincion')
        .isBoolean().withMessage('El campo peligro de extinción debe ser un valor booleano (true/false).'),
    validateResult
];
