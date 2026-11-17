/**
 * Para completar el sistema de autenticación flexible en el frontend, 
 * crearemos el componente src/components/Register.jsx. 
 * Este módulo se encarga de recibir los datos del nuevo usuario 
 * (nombre, apellido, usuario, correo, teléfono, DNI, contraseña y rol), 
 * validar que cumplan con los formatos correctos y comunicarse 
 * con el endpoint de registro de la API REST.
 * 
 */
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function Register({ onSwitchToLogin }) {
    const [form, setForm] = useState({
        usuario: '',
        password: '',
        apellido: '',
        nombre: '',
        dni: '',
        telefono: '',
        email: '',
        rol: 'operador' // Por defecto operador
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(form)
            });
            Swal.fire('¡Registro Exitoso!', data.message, 'success');
            onSwitchToLogin(); // Volver al login tras registrarse
        } catch (error) {
            Swal.fire('Error en el Registro', error.message, 'error');
        }
    };

    return (
        <div className="auth-container">
            <form className="card auth-card" onSubmit={handleRegister}>
                <h2>Crear Cuenta</h2>
                <p className="subtitle">Regístrese para acceder al Sistema Zoológico</p>

                <div className="form-group">
                    <label>Nombre de Usuario</label>
                    <input 
                        type="text" 
                        name="usuario" 
                        value={form.usuario} 
                        onChange={handleChange} 
                        placeholder="Ej: juanperez" 
                        required 
                    />
                </div>

                <div className="grid-form" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={form.nombre} 
                            onChange={handleChange} 
                            placeholder="Juan" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Apellido</label>
                        <input 
                            type="text" 
                            name="apellido" 
                            value={form.apellido} 
                            onChange={handleChange} 
                            placeholder="Pérez" 
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        placeholder="correo@ejemplo.com" 
                        required 
                    />
                </div>

                <div className="grid-form" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input 
                            type="text" 
                            name="telefono" 
                            value={form.telefono} 
                            onChange={handleChange} 
                            placeholder="+549..." 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>DNI</label>
                        <input 
                            type="text" 
                            name="dni" 
                            value={form.dni} 
                            onChange={handleChange} 
                            placeholder="12345678" 
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={form.password} 
                        onChange={handleChange} 
                        placeholder="Mínimo 6 caracteres" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Rol de Usuario</label>
                    <select name="rol" value={form.rol} onChange={handleChange}>
                        <option value="operador">Operador</option>
                        <option value="administrador">Administrador</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
                    Registrarse
                </button>

                <button type="button" className="btn-link" onClick={onSwitchToLogin}>
                    ¿Ya tienes una cuenta? Inicia sesión aquí
                </button>
            </form>
        </div>
    );
}
