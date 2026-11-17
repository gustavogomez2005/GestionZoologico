/*
Este middleware intercepta los resultados de express-validator 
y responde con un código 400 Bad Request 
y los errores detallados si alguna regla no se cumple.
*/

import { validationResult } from 'express-validator';

export const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Error de validación en los datos enviados',
            detalles: errors.array() 
        });
    }
    next();
};