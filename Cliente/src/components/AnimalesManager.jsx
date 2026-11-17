/**
 * A continuación se muestra el código completo para el componente
 *  src/components/AnimalesManager.jsx, 
 * desarrollado en React con soporte para formularios controlados,
 *  búsqueda dinámica por código, validaciones de sexo, año y procedencia,
 *  y con control estricto de roles (permitiendo la eliminación de 
 * animales únicamente a los usuarios con rol de administrador).
 * 
 */


import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function AnimalesManager({ rol }) {
    const [animales, setAnimales] = useState([]);
    const [zoos, setZoos] = useState([]);
    const [especies, setEspecies] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [editCodigo, setEditCodigo] = useState(null);

// Estado para controlar la imagen ampliada en el modal
    const [imagenZoom, setImagenZoom] = useState(null);

    const [form, setForm] = useState({
        zoo_codigo: '',
        especie_codigo: '',
        sexo: 'femenino',
        anio_nacimiento: new Date().getFullYear(),
        pais_origen: '',
        continente: '',
        imagen: ''
    });

    // Cargar listas auxiliares y animales al montar el componente
    const cargarDatosIniciales = async (q = '') => {
        try {
            const [dataAnimales, dataZoos, dataEspecies] = await Promise.all([
                apiFetch(`/animales${q ? `?q=${encodeURIComponent(q)}` : ''}`),
                apiFetch('/zoos'),
                apiFetch('/especies')
            ]);
            setAnimales(dataAnimales);
            setZoos(dataZoos);
            setEspecies(dataEspecies);
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };

    useEffect(() => { 
        cargarDatosIniciales(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editCodigo) {
                await apiFetch(`/animales/${editCodigo}`, { 
                    method: 'PUT', 
                    body: JSON.stringify(form) 
                });
                Swal.fire('Actualizado', 'Información del animal modificada correctamente', 'success');
            } else {
                await apiFetch('/animales', { 
                    method: 'POST', 
                    body: JSON.stringify(form) 
                });
                Swal.fire('Registrado', 'Nuevo animal agregado exitosamente', 'success');
            }

            // Resetear formulario
            setForm({
                zoo_codigo: '',
                especie_codigo: '',
                sexo: 'femenino',
                anio_nacimiento: new Date().getFullYear(),
                pais_origen: '',
                continente: '',
                imagen: ''
            });
            setEditCodigo(null);
            cargarDatosIniciales();
        } catch (err) {
            Swal.fire('Error de validación', err.message, 'warning');
        }
    };

    const handleEdit = (animal) => {
        setEditCodigo(animal.codigo);
        setForm({
            zoo_codigo: animal.zoo_codigo,
            especie_codigo: animal.especie_codigo,
            sexo: animal.sexo,
            anio_nacimiento: animal.anio_nacimiento,
            pais_origen: animal.pais_origen,
            continente: animal.continente,
            imagen: animal.imagen || ''
        });
    };

    const handleDelete = async (codigo) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar animal?',
            text: 'Esta acción dará de baja permanentemente al registro.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                await apiFetch(`/animales/${codigo}`, { method: 'DELETE' });
                Swal.fire('Eliminado', 'El animal fue dado de baja correctamente.', 'success');
                cargarDatosIniciales();
            } catch (err) {
                Swal.fire('Acción denegada', err.message, 'error');
            }
        }
    };

    return (
        <div className="module-container">
            {/* Formulario de Alta / Modificación */}
            <div className="card">
                <h3>{editCodigo ? `Editando Animal #${editCodigo}` : 'Registrar Nuevo Animal'}</h3>
                <form className="grid-form" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>Zoológico de Destino</label>
                        <select 
                            value={form.zoo_codigo} 
                            onChange={e => setForm({...form, zoo_codigo: e.target.value})} 
                            required
                        >
                            <option value="">Seleccione un zoológico...</option>
                            {zoos.map(z => (
                                <option key={z.codigo} value={z.codigo}>{z.nombre} ({z.pais})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Especie</label>
                        <select 
                            value={form.especie_codigo} 
                            onChange={e => setForm({...form, especie_codigo: e.target.value})} 
                            required
                        >
                            <option value="">Seleccione una especie...</option>
                            {especies.map(esp => (
                                <option key={esp.codigo} value={esp.codigo}>{esp.nombre_vulgar} ({esp.nombre_cientifico})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Sexo</label>
                        <select 
                            value={form.sexo} 
                            onChange={e => setForm({...form, sexo: e.target.value})} 
                            required
                        >
                            <option value="femenino">Femenino</option>
                            <option value="masculino">Masculino</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Año de Nacimiento</label>
                        <input 
                            type="number" 
                            min="1900" 
                            max={new Date().getFullYear()} 
                            value={form.anio_nacimiento} 
                            onChange={e => setForm({...form, anio_nacimiento: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>País de Origen</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Kenia (solo letras)" 
                            value={form.pais_origen} 
                            onChange={e => setForm({...form, pais_origen: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Continente</label>
                        <input 
                            type="text" 
                            placeholder="Ej: África (solo letras)" 
                            value={form.continente} 
                            onChange={e => setForm({...form, continente: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>URL de Imagen (Opcional)</label>
                        <input 
                            type="url" 
                            placeholder="https://ejemplo.com/imagen.jpg" 
                            value={form.imagen} 
                            onChange={e => setForm({...form, imagen: e.target.value})} 
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            {editCodigo ? 'Guardar Cambios' : 'Registrar Animal'}
                        </button>
                        {editCodigo && (
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={() => { 
                                    setEditCodigo(null); 
                                    setForm({ zoo_codigo: '', especie_codigo: '', sexo: 'femenino', anio_nacimiento: new Date().getFullYear(), pais_origen: '', continente: '', imagen: '' }); 
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Listado y Búsqueda */}
{/* 
            <div className="card">
                <div className="table-header">
                    <h3>Listado de Animales</h3>
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Buscar por código de animal..." 
                            value={busqueda} 
                            onChange={e => setBusqueda(e.target.value)} 
                        />
                        <button className="btn btn-primary" onClick={() => cargarDatosIniciales(busqueda)}>
                            Buscar
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Cód.</th>
                                <th>Zoológico</th>
                                <th>Especie</th>
                                <th>Sexo</th>
                                <th>Nacimiento</th>
                                <th>Origen</th>
                                <th>Continente</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animales.length > 0 ? (
                                animales.map(a => (
                                    <tr key={a.codigo}>
                                        <td>{a.codigo}</td>
                                        <td>{a.zoo_nombre || a.zoo_codigo}</td>
                                        <td>{a.especie_nombre || a.especie_codigo}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{a.sexo}</td>
                                        <td>{a.anio_nacimiento}</td>
                                        <td>{a.pais_origen}</td>
                                        <td>{a.continente}</td>
                                        <td className="actions-cell">
                                            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(a)}>
                                                Editar
                                            </button>
                                            {rol === 'administrador' && (
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.codigo)}>
                                                    Eliminar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="empty-state">No se encontraron animales registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

 */}

        {/* Listado y Búsqueda */}
        <div className="card">
            <div className="table-header">
                <h3>Listado de Animales</h3>
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="Buscar por código de animal..." 
                        value={busqueda} 
                        onChange={e => setBusqueda(e.target.value)} 
                    />
                    <button className="btn btn-primary" onClick={() => cargarDatosIniciales(busqueda)}>
                        Buscar
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Cód.</th>
                            <th>Imagen</th> {/* <- Nueva columna */}
                            <th>Zoológico</th>
                            <th>Especie</th>
                            <th>Sexo</th>
                            <th>Nacimiento</th>
                            <th>Origen</th>
                            <th>Continente</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animales.length > 0 ? (
                            animales.map(a => (
                                <tr key={a.codigo}>
                                    <td>{a.codigo}</td>
<td>
                                        {/* Miniatura interactiva con cursor pointer y evento onClick */}
                                        <img 
                                            src={a.imagen || 'https://via.placeholder.com/50?text=No+Img'} 
                                            alt="Animal" 
                                            onClick={() => setImagenZoom(a.imagen || 'https://via.placeholder.com/300?text=Sin+Imagen')}
                                            style={{ 
                                                width: '45px', 
                                                height: '45px', 
                                                objectFit: 'cover', 
                                                borderRadius: '6px',
                                                border: '1px solid #e5e7eb',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s'
                                            }} 
                                            title="Haz clic para ampliar"
                                        />
                                    </td>
                                    <td>{a.zoo_nombre || a.zoo_codigo}</td>
                                    <td>{a.especie_nombre || a.especie_codigo}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{a.sexo}</td>
                                    <td>{a.anio_nacimiento}</td>
                                    <td>{a.pais_origen}</td>
                                    <td>{a.continente}</td>
                                    <td className="actions-cell">
                                        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(a)}>
                                            Editar
                                        </button>
                                        {rol === 'administrador' && (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.codigo)}>
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="empty-state">No se encontraron animales registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        {/* --- VENTANA MODAL PARA AMPLIAR IMAGEN --- */}
            {imagenZoom && (
                <div className="modal-overlay" onClick={() => setImagenZoom(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setImagenZoom(null)}>&times;</button>
                        <img src={imagenZoom} alt="Vista ampliada" className="modal-img" />
                    </div>
                </div>
            )}
        </div>
    );
}

