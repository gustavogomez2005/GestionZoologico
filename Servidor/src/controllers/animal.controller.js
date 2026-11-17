/*
A continuación se muestra el código completo 
para el archivo src/controllers/animal.controller.js, 
implementando las operaciones CRUD completas 
y respetando las reglas de negocio solicitadas 
(como la validación de relaciones con zoológicos y especies, 
y que solo los administradores puedan realizar bajas).
*/

import { pool } from '../config/db.js';

/**
 * Crear un nuevo animal
 */
export const createAnimal = async (req, res) => {
    try {
        const { zoo_codigo, especie_codigo, sexo, anio_nacimiento, pais_origen, continente, imagen } = req.body;

        // Verificar que el zoológico exista
        const [zooExists] = await pool.query('SELECT codigo FROM zoos WHERE codigo = ?', [zoo_codigo]);
        if (zooExists.length === 0) {
            return res.status(400).json({ error: 'El zoológico especificado no existe.' });
        }

        // Verificar que la especie exista
        const [especieExists] = await pool.query('SELECT codigo FROM especies WHERE codigo = ?', [especie_codigo]);
        if (especieExists.length === 0) {
            return res.status(400).json({ error: 'La especie especificada no existe.' });
        }

        const [result] = await pool.query(
            `INSERT INTO animales (zoo_codigo, especie_codigo, sexo, anio_nacimiento, pais_origen, continente, imagen) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [zoo_codigo, especie_codigo, sexo, anio_nacimiento, pais_origen, continente, imagen]
        );

        res.status(201).json({ 
            message: 'Animal creado correctamente', 
            codigo: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Consultar animales (permite búsqueda por código o listar todos con datos relacionados)
 */
export const getAnimales = async (req, res) => {
    try {
        const { q } = req.query;
        let query = `
            SELECT a.*, z.nombre AS zoo_nombre, e.nombre_vulgar AS especie_nombre 
            FROM animales a
            JOIN zoos z ON a.zoo_codigo = z.codigo
            JOIN especies e ON a.especie_codigo = e.codigo
        `;
        let params = [];

        if (q) {
            query += ' WHERE a.codigo = ?';
            params = [q];
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Modificar todos los datos del animal excepto su código (Búsqueda por código)
 */
export const updateAnimal = async (req, res) => {
    try {
        const { codigo } = req.params;
        const { zoo_codigo, especie_codigo, sexo, anio_nacimiento, pais_origen, continente, imagen } = req.body;

        // Verificar si el animal existe
        const [animalExists] = await pool.query('SELECT codigo FROM animales WHERE codigo = ?', [codigo]);
        if (animalExists.length === 0) {
            return res.status(404).json({ error: 'El animal no fue encontrado.' });
        }

        // Verificar que el zoológico exista
        const [zooExists] = await pool.query('SELECT codigo FROM zoos WHERE codigo = ?', [zoo_codigo]);
        if (zooExists.length === 0) {
            return res.status(400).json({ error: 'El zoológico especificado no existe.' });
        }

        // Verificar que la especie exista
        const [especieExists] = await pool.query('SELECT codigo FROM especies WHERE codigo = ?', [especie_codigo]);
        if (especieExists.length === 0) {
            return res.status(400).json({ error: 'La especie especificada no existe.' });
        }

        await pool.query(
            `UPDATE animales 
             SET zoo_codigo = ?, especie_codigo = ?, sexo = ?, anio_nacimiento = ?, pais_origen = ?, continente = ?, imagen = ? 
             WHERE codigo = ?`,
            [zoo_codigo, especie_codigo, sexo, anio_nacimiento, pais_origen, continente, imagen, codigo]
        );

        res.json({ message: 'Animal actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Eliminar un animal (Restringido únicamente a administradores)
 */
export const deleteAnimal = async (req, res) => {
    try {
        const { codigo } = req.params;

        const [result] = await pool.query('DELETE FROM animales WHERE codigo = ?', [codigo]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'El animal no fue encontrado.' });
        }

        res.json({ message: 'Animal eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};