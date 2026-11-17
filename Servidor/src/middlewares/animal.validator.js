/*
Valida que el sexo sea exclusivamente femenino o masculino, 
que el país y continente tengan formato alfabético correcto, 
y que las relaciones numéricas existan.
*/

import { body } from 'express-validator';
import { validateResult } from './validator.middleware.js';

const soloLetrasYEspacios = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

export const validateAnimal = [
    body('zoo_codigo')
        .isInt({ min: 1 }).withMessage('El código del zoológico debe ser un entero válido.'),
    body('especie_codigo')
        .isInt({ min: 1 }).withMessage('El código de la especie debe ser un entero válido.'),
    body('sexo')
        .trim()
        .isIn(['femenino', 'masculino']).withMessage('El sexo del animal debe ser estrictamente "femenino" o "masculino".'),
    body('anio_nacimiento')
        .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Ingrese un año de nacimiento válido.'),
    body('pais_origen')
        .trim()
        .notEmpty().withMessage('El país de origen es obligatorio.')
        .matches(soloLetrasYEspacios).withMessage('El país de origen solo debe contener letras y espacios.'),
    body('continente')
        .trim()
        .notEmpty().withMessage('El continente es obligatorio.')
        .matches(soloLetrasYEspacios).withMessage('El continente solo debe contener letras y espacios.'),
    validateResult
];
