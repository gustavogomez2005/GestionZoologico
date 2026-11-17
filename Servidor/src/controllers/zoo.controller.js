/*
Garantiza que no se elimine un zoo con animales a menos que se reubiquen,
 y aplica validaciones estrictas de formato.

JavaScript
*/

import { pool } from '../config/db.js';

export const createZoo = async (req, res) => {
    try {
        const { nombre, ciudad, pais, tamano, presupuesto_anual, imagen } = req.body;
        const [result] = await pool.query(
            'INSERT INTO zoos (nombre, ciudad, pais, tamano, presupuesto_anual, imagen) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, ciudad, pais, tamano, presupuesto_anual, imagen]
        );
        res.status(201).json({ message: 'Zoológico creado correctamente', codigo: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getZoos = async (req, res) => {
    try {
        const { q } = req.query;
        let query = 'SELECT * FROM zoos';
        let params = [];
        if (q) {
            query += ' WHERE codigo = ? OR nombre LIKE ?';
            params = [q, `%${q}%`];
        }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateZoo = async (req, res) => {
    try {
        const { codigo } = req.params;
        const { nombre, ciudad, pais, tamano, presupuesto_anual, imagen } = req.body;
        await pool.query(
            'UPDATE zoos SET nombre = ?, ciudad = ?, pais = ?, tamano = ?, presupuesto_anual = ?, imagen = ? WHERE codigo = ?',
            [nombre, ciudad, pais, tamano, presupuesto_anual, imagen, codigo]
        );
        res.json({ message: 'Zoológico actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteZoo = async (req, res) => {
    try {
        const { codigo } = req.params;
        const [animals] = await pool.query('SELECT COUNT(*) as total FROM animales WHERE zoo_codigo = ?', [codigo]);
        
        if (animals[0].total > 0) {
            return res.status(400).json({ error: 'No se puede eliminar el zoológico porque contiene animales. Reubique los animales primero.' });
        }

        await pool.query('DELETE FROM zoos WHERE codigo = ?', [codigo]);
        res.json({ message: 'Zoológico eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
