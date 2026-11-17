/*
Soporta inicio de sesión mediante usuario, correo o teléfono, 
enlace a proveedores sociales y alertas de bloqueo por intentos fallidos.
 */


/*
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function Login({ onLoginSuccess }) {
    const [credencial, setCredencial] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ credencial, password }),
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            Swal.fire('Bienvenido', data.message, 'success');
            onLoginSuccess(data);
        } catch (error) {
            Swal.fire('Acceso Denegado', error.message, 'error');
        }
    };

    const handleForgot = async () => {
        const { value: email } = await Swal.fire({
            title: 'Recuperar Contraseña',
            input: 'email',
            inputLabel: 'Ingresa tu correo electrónico registrado',
            showCancelButton: true,
        });
        if (email) {
            try {
                const res = await apiFetch('/auth/forgot-password', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                });
                Swal.fire('Enviado', res.message, 'info');
            } catch (err) {
                Swal.fire('Error', err.message, 'error');
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="card auth-card" onSubmit={handleSubmit}>
                <h2>Sistema de Gestión Zoológica</h2>
                <p className="subtitle">Ingresa con tu usuario, email o teléfono</p>
                
                <div className="form-group">
                    <label>Credencial</label>
                    <input
                        type="text"
                        value={credencial}
                        onChange={(e) => setCredencial(e.target.value)}
                        placeholder="Usuario, correo o teléfono"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block">Iniciar Sesión</button>
                
                <button type="button" className="btn-link" onClick={handleForgot}>
                    ¿Te olvidaste la contraseña?
                </button>

                <div className="social-login">
                    <a href="https://localhost:3000/api/auth/google" className="btn btn-outline">Google</a>
                    <a href="https://localhost:3000/api/auth/github" className="btn btn-outline">GitHub</a>
                </div>
            </form>
        </div>
    );
}

*/

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
    const [credencial, setCredencial] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ credencial, password }),
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            Swal.fire('Bienvenido', data.message, 'success');
            onLoginSuccess(data);
        } catch (error) {
            Swal.fire('Acceso Denegado', error.message, 'error');
        }
    };

    const handleForgot = async () => {
        const { value: email } = await Swal.fire({
            title: 'Recuperar Contraseña',
            input: 'email',
            inputLabel: 'Ingresa tu correo electrónico registrado',
            showCancelButton: true,
        });
        if (email) {
            try {
                const res = await apiFetch('/auth/forgot-password', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                });
                Swal.fire('Enviado', res.message, 'info');
            } catch (err) {
                Swal.fire('Error', err.message, 'error');
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="card auth-card" onSubmit={handleSubmit}>
                <h2>Sistema de Gestión Zoológica</h2>
                <p className="subtitle">Ingresa con tu usuario, email o teléfono</p>
                
                <div className="form-group">
                    <label>Credencial</label>
                    <input
                        type="text"
                        value={credencial}
                        onChange={(e) => setCredencial(e.target.value)}
                        placeholder="Usuario, correo o teléfono"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block">Iniciar Sesión</button>
                
                <button type="button" className="btn-link" onClick={handleForgot}>
                    ¿Te olvidaste la contraseña?
                </button>

                <button type="button" className="btn-link" onClick={onSwitchToRegister} style={{ color: '#1565c0' }}>
                    ¿No tienes cuenta? Regístrate aquí
                </button>

                <div className="social-login">
                    <a href="https://localhost:3000/api/auth/google" className="btn btn-outline">Google</a>
                    <a href="https://localhost:3000/api/auth/github" className="btn btn-outline">GitHub</a>
                </div>
            </form>
        </div>
    );
}