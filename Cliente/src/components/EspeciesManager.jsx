/**
 * A continuación se muestra el código completo
 *  para el componente src/components/EspeciesManager.jsx, 
 * desarrollado en React. Este componente permite realizar
 *  altas, búsquedas (por código o nombre vulgar), modificaciones completas
 *  de datos excepto el código, y bajas con 
 * validación de seguridad para administradores y
 *  restricción de eliminación si existen animales asociados.
 * 
 */

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function EspeciesManager({ rol }) {
    const [especies, setEspecies] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [editCodigo, setEditCodigo] = useState(null);
    
    const [form, setForm] = useState({
        nombre_vulgar: '',
        nombre_cientifico: '',
        familia: '',
        peligro_extincion: false
    });

    const cargarEspecies = async (q = '') => {
        try {
            const data = await apiFetch(`/especies${q ? `?q=${encodeURIComponent(q)}` : ''}`);
            setEspecies(data);
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };

    useEffect(() => { 
        cargarEspecies(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                peligro_extincion: form.peligro_extincion === true || form.peligro_extincion === 'true'
            };

            if (editCodigo) {
                await apiFetch(`/especies/${editCodigo}`, { 
                    method: 'PUT', 
                    body: JSON.stringify(payload) 
                });
                Swal.fire('Actualizado', 'Información de la especie modificada correctamente', 'success');
            } else {
                await apiFetch('/especies', { 
                    method: 'POST', 
                    body: JSON.stringify(payload) 
                });
                Swal.fire('Registrado', 'Nueva especie agregada exitosamente', 'success');
            }

            setForm({
                nombre_vulgar: '',
                nombre_cientifico: '',
                familia: '',
                peligro_extincion: false
            });
            setEditCodigo(null);
            cargarEspecies();
        } catch (err) {
            Swal.fire('Error de validación', err.message, 'warning');
        }
    };

    const handleEdit = (especie) => {
        setEditCodigo(especie.codigo);
        setForm({
            nombre_vulgar: especie.nombre_vulgar,
            nombre_cientifico: especie.nombre_cientifico,
            familia: especie.familia,
            peligro_extincion: Boolean(especie.peligro_extincion)
        });
    };

    const handleDelete = async (codigo) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar especie?',
            text: 'No podrá eliminarse si hay animales en los zoológicos que pertenecen a la misma.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                await apiFetch(`/especies/${codigo}`, { method: 'DELETE' });
                Swal.fire('Eliminado', 'La especie fue dada de baja correctamente.', 'success');
                cargarEspecies();
            } catch (err) {
                Swal.fire('Acción denegada', err.message, 'error');
            }
        }
    };

    return (
        <div className="module-container">
            {/* Formulario de Alta / Modificación */}
            <div className="card">
                <h3>{editCodigo ? `Editando Especie #${editCodigo}` : 'Registrar Nueva Especie'}</h3>
                <form className="grid-form" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>Nombre Vulgar</label>
                        <input 
                            type="text" 
                            placeholder="Ej: León (solo letras)" 
                            value={form.nombre_vulgar} 
                            onChange={e => setForm({...form, nombre_vulgar: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre Científico</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Panthera leo (solo letras)" 
                            value={form.nombre_cientifico} 
                            onChange={e => setForm({...form, nombre_cientifico: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Familia</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Felidae (solo letras)" 
                            value={form.familia} 
                            onChange={e => setForm({...form, familia: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Peligro de Extinción</label>
                        <select 
                            value={form.peligro_extincion ? 'true' : 'false'} 
                            onChange={e => setForm({...form, peligro_extincion: e.target.value === 'true'})}
                            required
                        >
                            <option value="false">No (Estable)</option>
                            <option value="true">Sí (En Peligro)</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            {editCodigo ? 'Guardar Cambios' : 'Registrar Especie'}
                        </button>
                        {editCodigo && (
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={() => { 
                                    setEditCodigo(null); 
                                    setForm({ nombre_vulgar: '', nombre_cientifico: '', familia: '', peligro_extincion: false }); 
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Listado y Búsqueda */}
            <div className="card">
                <div className="table-header">
                    <h3>Listado de Especies</h3>
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Buscar por código o nombre vulgar..." 
                            value={busqueda} 
                            onChange={e => setBusqueda(e.target.value)} 
                        />
                        <button className="btn btn-primary" onClick={() => cargarEspecies(busqueda)}>
                            Buscar
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Cód.</th>
                                <th>Nombre Vulgar</th>
                                <th>Nombre Científico</th>
                                <th>Familia</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {especies.length > 0 ? (
                                especies.map(esp => (
                                    <tr key={esp.codigo}>
                                        <td>{esp.codigo}</td>
                                        <td>{esp.nombre_vulgar}</td>
                                        <td><em>{esp.nombre_cientifico}</em></td>
                                        <td>{esp.familia}</td>
                                        <td>
                                            <span style={{ 
                                                color: esp.peligro_extincion ? '#d32f2f' : '#2e7d32',
                                                fontWeight: '600' 
                                            }}>
                                                {esp.peligro_extincion ? 'En Peligro' : 'Estable'}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(esp)}>
                                                Editar
                                            </button>
                                            {rol === 'administrador' && (
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(esp.codigo)}>
                                                    Eliminar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-state">No se encontraron especies registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}