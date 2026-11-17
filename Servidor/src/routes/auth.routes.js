/*
Agregamos los endpoints para iniciar el flujo de OAuth y manejar 
las respuestas exitosas generando el JWT.
*/

import { Router } from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import { register, login, forgotPassword, logout } from '../controllers/auth.controller.js';

const router = Router();

// Rutas locales existentes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/logout', logout);

// --- RUTAS GOOGLE ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login-error' }),
    (req, res) => {
        // Generar JWT para el usuario autenticado por Google
        const token = jwt.sign(
            { codigo: req.user.codigo, rol: req.user.rol, usuario: req.user.usuario }, 
            process.env.JWT_SECRET || 'secreto', 
            { expiresIn: '8h' }
        );
        // Redirigir al frontend con el token (por query params o cookie)
        res.redirect(`https://tufrontend.com/auth-success?token=${token}&rol=${req.user.rol}`);
    }
);

// --- RUTAS GITHUB ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

router.get('/github/callback', 
    passport.authenticate('github', { session: false, failureRedirect: '/login-error' }),
    (req, res) => {
        // Generar JWT para el usuario autenticado por GitHub
        const token = jwt.sign(
            { codigo: req.user.codigo, rol: req.user.rol, usuario: req.user.usuario }, 
            process.env.JWT_SECRET || 'secreto', 
            { expiresIn: '8h' }
        );
        res.redirect(`https://tufrontend.com/auth-success?token=${token}&rol=${req.user.rol}`);
    }
);

export default router;
