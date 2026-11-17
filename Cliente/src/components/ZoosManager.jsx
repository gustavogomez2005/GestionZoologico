/**
Implementa búsqueda, altas, modificaciones y eliminación protegida 
(solo visible/ejecutable para el rol administrador). 
Nota: Los módulos EspeciesManager.jsx y AnimalesManager.jsx 
siguen exactamente este mismo patrón. * 
 */

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function ZoosManager({ rol }) {
    const [zoos, setZoos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [editCodigo, setEditCodigo] = useState(null);
    const [form, setForm] = useState({
        nombre: '', ciudad: '', pais: '', tamano: '', presupuesto_anual: '', imagen: ''
    });

    const cargarZoos = async (q = '') => {
        try {
            const data = await apiFetch(`/zoos${q ? `?q=${encodeURIComponent(q)}` : ''}`);
            setZoos(data);
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };

    useEffect(() => { cargarZoos(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editCodigo) {
                await apiFetch(`/zoos/${editCodigo}`, { method: 'PUT', body: JSON.stringify(form) });
                Swal.fire('Actualizado', 'Zoológico modificado correctamente', 'success');
            } else {
                await apiFetch('/zoos', { method: 'POST', body: JSON.stringify(form) });
                Swal.fire('Creado', 'Zoológico registrado correctamente', 'success');
            }
            setForm({ nombre: '', ciudad: '', pais: '', tamano: '', presupuesto_anual: '', imagen: '' });
            setEditCodigo(null);
            cargarZoos();
        } catch (err) {
            Swal.fire('Error de validación', err.message, 'warning');
        }
    };

    const handleEdit = (zoo) => {
        setEditCodigo(zoo.codigo);
        setForm({
            nombre: zoo.nombre,
            ciudad: zoo.ciudad,
            pais: zoo.pais,
            tamano: zoo.tamano,
            presupuesto_anual: zoo.presupuesto_anual,
            imagen: zoo.imagen || ''
        });
    };

    const handleDelete = async (codigo) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar zoológico?',
            text: 'No podrá eliminarse si aún alberga animales.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar'
        });
        if (confirm.isConfirmed) {
            try {
                await apiFetch(`/zoos/${codigo}`, { method: 'DELETE' });
                Swal.fire('Eliminado', 'El zoológico fue dado de baja.', 'success');
                cargarZoos();
            } catch (err) {
                Swal.fire('Operación denegada', err.message, 'error');
            }
        }
    };

    return (
        <div className="module-container">
            <div className="card">
                <h3>{editCodigo ? `Editando Zoológico #${editCodigo}` : 'Registrar Nuevo Zoológico'}</h3>
                <form className="grid-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nombre (solo letras)" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                    <input type="text" placeholder="Ciudad (solo letras)" value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} required />
                    <input type="text" placeholder="País (solo letras)" value={form.pais} onChange={e => setForm({...form, pais: e.target.value})} required />
                    <input type="number" placeholder="Tamaño (m²)" value={form.tamano} onChange={e => setForm({...form, tamano: e.target.value})} required />
                    <input type="number" placeholder="Presupuesto Anual ($)" value={form.presupuesto_anual} onChange={e => setForm({...form, presupuesto_anual: e.target.value})} required />
                    <input type="url" placeholder="URL Imagen (opcional)" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} />
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">{editCodigo ? 'Guardar Cambios' : 'Agregar Zoológico'}</button>
                        {editCodigo && <button type="button" className="btn btn-secondary" onClick={() => { setEditCodigo(null); setForm({ nombre: '', ciudad: '', pais: '', tamano: '', presupuesto_anual: '', imagen: '' }); }}>Cancelar</button>}
                    </div>
                </form>
            </div>

            <div className="card">
                <div className="table-header">
                    <h3>Listado de Zoológicos</h3>
                    <div className="search-box">
                        <input type="text" placeholder="Buscar por código o nombre..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                        <button className="btn btn-primary" onClick={() => cargarZoos(busqueda)}>Buscar</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Cód.</th>
                                <th>Nombre</th>
                                <th>Ubicación</th>
                                <th>Tamaño (m²)</th>
                                <th>Presupuesto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {zoos.map(z => (
                                <tr key={z.codigo}>
                                    <td>{z.codigo}</td>
                                    <td>{z.nombre}</td>
                                    <td>{z.ciudad}, {z.pais}</td>
                                    <td>{Number(z.tamano).toLocaleString()}</td>
                                    <td>${Number(z.presupuesto_anual).toLocaleString()}</td>
                                    <td className="actions-cell">
                                        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(z)}>Editar</button>
                                        {rol === 'administrador' && (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(z.codigo)}>Eliminar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}