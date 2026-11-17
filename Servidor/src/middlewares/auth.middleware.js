/*
Para asegurar que las rutas protegidas de la API RESTful
 solo sean accesibles por usuarios debidamente autenticados 
 y con los privilegios correctos (roles de administrador u operador), 
 implementamos un middleware modular de autenticación 
 y control de acceso basado en JSON Web Tokens (JWT).
*/

import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar la validez del token JWT en las peticiones.
 * Extrae el token del header 'Authorization: Bearer <token>' y lo decodifica.
 */
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ 
            error: 'Acceso denegado. No se proporcionó un token de autenticación.' 
        });
    }

    // El formato estándar es "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            error: 'Formato de token inválido o ausente.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_por_defecto');
        
        // Adjuntamos la información decodificada del usuario (codigo, rol, usuario) al objeto req
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'El token ha expirado. Por favor, inicie sesión nuevamente.' 
            });
        }
        return res.status(403).json({ 
            error: 'Token inválido o manipulado.' 
        });
    }
};

/**
 * Middleware para restringir el acceso exclusivamente a usuarios con rol 'administrador'.
 * Nota: Debe utilizarse siempre después de 'verificarToken'.
 */
export const esAdministrador = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'No se encontró información del usuario autenticado.' 
        });
    }

    if (req.user.rol !== 'administrador') {
        return res.status(403).json({ 
            error: 'Acceso prohibido. Esta acción requiere privilegios de Administrador.' 
        });
    }

    next();
};

/**
 * Middleware opcional para permitir acceso tanto a operadores como a administradores.
 */
export const esOperadorOAdministrador = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'No se encontró información del usuario autenticado.' 
        });
    }

    if (req.user.rol !== 'administrador' && req.user.rol !== 'operador') {
        return res.status(403).json({ 
            error: 'Acceso prohibido. No cuenta con el rol necesario.' 
        });
    }

    next();
};
