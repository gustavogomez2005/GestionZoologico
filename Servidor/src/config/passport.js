/*
Para integrar la autenticación social con Google y GitHub en nuestra API RESTful,
 el estándar de la industria en Node.js es utilizar Passport.js 
 junto con sus respectivas estrategias (passport-google-oauth20 y passport-github2).

El flujo consiste en redirigir al usuario al proveedor de identidad, 
recibir el callback con los datos del usuario (correo, nombre, etc.), 
verificar si ya existe en nuestra tabla usuarios 
(o registrarlo automáticamente si es su primera vez) y, 
finalmente, emitir un token JWT propio para que el cliente pueda autenticarse en el sistema.

1. Instalación de Dependencias
Ejecuta el siguiente comando en tu proyecto para instalar Passport 
y las estrategias necesarias:

npm install passport passport-google-oauth20 passport-github2 express-session

2. Configuración de Estrategias (src/config/passport.js)
Configuramos Passport para gestionar los perfiles de Google y GitHub, 
conectándolos con nuestra base de datos MySQL.

*/

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

// Función auxiliar para registrar o recuperar usuario social
async function handleSocialUser(profile, provider) {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@${provider}.com`;
    const nombre = profile.name?.givenName || profile.displayName || 'Usuario';
    const apellido = profile.name?.familyName || 'Externo';
    const usuario = profile.username || email.split('@')[0] + '_' + provider;

    // Buscar si ya existe el usuario por email
    const [existing] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (existing.length > 0) {
        return existing[0];
    }

    // Si no existe, lo creamos automáticamente con un rol por defecto ('operador')
    const [result] = await pool.query(
        'INSERT INTO usuarios (usuario, password, apellido, nombre, dni, telefono, email, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [usuario, 'OAUTH_USER_NO_PASSWORD', apellido, nombre, 'SN-' + profile.id, 'SN-' + profile.id, email, 'operador']
    );

    const [newUser] = await pool.query('SELECT * FROM usuarios WHERE codigo = ?', [result.insertId]);
    return newUser[0];
}

// Configuración Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await handleSocialUser(profile, 'google');
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Configuración GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await handleSocialUser(profile, 'github');
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

export default passport;

