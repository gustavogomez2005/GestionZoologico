/*
Validación para impedir eliminación si existen animales asociados y 
actualizaciones completas excepto el código.

*/

import { pool } from '../config/db.js';

export const createEspecie = async (req, res) => {
    try {
        const { nombre_vulgar, nombre_cientifico, familia, peligro_extincion } = req.body;
        const [result] = await pool.query(
            'INSERT INTO especies (nombre_vulgar, nombre_cientifico, familia, peligro_extincion) VALUES (?, ?, ?, ?)',
            [nombre_vulgar, nombre_cientifico, familia, peligro_extincion]
        );
        res.status(201).json({ message: 'Especie creada correctamente', codigo: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEspecies = async (req, res) => {
    try {
        const { q } = req.query;
        let query = 'SELECT * FROM especies';
        let params = [];
        if (q) {
            query += ' WHERE codigo = ? OR nombre_vulgar LIKE ?';
            params = [q, `%${q}%`];
        }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateEspecie = async (req, res) => {
    try {
        const { codigo } = req.params;
        const { nombre_vulgar, nombre_cientifico, familia, peligro_extincion } = req.body;
        await pool.query(
            'UPDATE especies SET nombre_vulgar = ?, nombre_cientifico = ?, familia = ?, peligro_extincion = ? WHERE codigo = ?',
            [nombre_vulgar, nombre_cientifico, familia, peligro_extincion, codigo]
        );
        res.json({ message: 'Especie actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteEspecie = async (req, res) => {
    try {
        const { codigo } = req.params;
        const [animals] = await pool.query('SELECT COUNT(*) as total FROM animales WHERE especie_codigo = ?', [codigo]);
        
        if (animals[0].total > 0) {
            return res.status(400).json({ error: 'No se puede eliminar la especie porque existen animales asociados.' });
        }

        await pool.query('DELETE FROM especies WHERE codigo = ?', [codigo]);
        res.json({ message: 'Especie eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
