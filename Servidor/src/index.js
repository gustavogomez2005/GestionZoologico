/*
Configuración inicial de Express, middlewares y arranque del servidor 
asegurando el protocolo HTTPS mediante certificados SSL/TLS.
*/

import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import zooRoutes from './routes/zoo.routes.js';
import especieRoutes from './routes/especie.routes.js';
import animalRoutes from './routes/animal.routes.js';
import reporteRoutes from './routes/reporte.routes.js';

/* Asegúrate de inicializar Passport en tu archivo principal de Express 
antes de registrar las rutas de autenticación */
import passport from './config/passport.js';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// ... después de express.json()
app.use(passport.initialize());

// Rutas API REST
app.use('/api/auth', authRoutes);
app.use('/api/zoos', zooRoutes);
app.use('/api/especies', especieRoutes);
app.use('/api/animales', animalRoutes);
app.use('/api/reportes', reporteRoutes);

const PORT = process.env.PORT || 3000;

// Configuración opcional HTTPS (requiere certificados válidos o autofirmados)
try {
    const sslOptions = {
        //key: fs.readFileSync('./cert/server.key'),
        //cert: fs.readFileSync('./cert/server.crt')
        key: fs.readFileSync(path.join(__dirname, '../ssl/server.key')),
        cert: fs.readFileSync(path.join(__dirname, '../ssl/server.cert'))
    };

    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`Servidor HTTPS seguro corriendo en el puerto ${PORT}`);
    });
} catch (e) {
    // Fallback a HTTP si no se encuentran los certificados locales configurados
    app.listen(PORT, () => {
        console.log(`Servidor HTTP corriendo en el puerto ${PORT} (Advertencia: Certificados HTTPS no encontrados)`);
    });
}
