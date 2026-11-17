/*
Valida que el nombre, ciudad y país contengan exclusivamente
 letras y espacios en blanco, además de verificar que los campos numéricos sean válidos.
*/

import { body } from 'express-validator';
import { validateResult } from './validator.middleware.js';

const soloLetrasYEspacios = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

export const validateZoo = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre del zoológico es obligatorio.')
        .matches(soloLetrasYEspacios).withMessage('El nombre del zoológico solo debe contener letras y espacios.'),
    body('ciudad')
        .trim()
        .notEmpty().withMessage('La ciudad es obligatoria.')
        .matches(soloLetrasYEspacios).withMessage('La ciudad solo debe contener letras y espacios.'),
    body('pais')
        .trim()
        .notEmpty().withMessage('El país es obligatorio.')
        .matches(soloLetrasYEspacios).withMessage('El país solo debe contener letras y espacios.'),
    body('tamano')
        .isNumeric().withMessage('El tamaño debe ser un valor numérico (en m2).'),
    body('presupuesto_anual')
        .isNumeric().withMessage('El presupuesto anual debe ser un valor numérico.'),
    validateResult
];
