import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ZoosManager from './components/ZoosManager';
import EspeciesManager from './components/EspeciesManager';
import AnimalesManager from './components/AnimalesManager';
import Reportes from './components/Reportes';
import './App.css';

export default function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [rol, setRol] = useState(localStorage.getItem('rol'));
    const [tab, setTab] = useState('zoos');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        setToken(null);
        setRol(null);
        setIsRegistering(false);
    };

    // Si el usuario no ha iniciado sesión, mostramos Login o Register según corresponda
    if (!token) {
        return isRegistering ? (
            <Register onSwitchToLogin={() => setIsRegistering(false)} />
        ) : (
            <Login 
                onLoginSuccess={(data) => { 
                    setToken(data.token); 
                    setRol(data.rol); 
                }} 
                onSwitchToRegister={() => setIsRegistering(true)} 
            />
        );
    }

    // Interfaz principal protegida con navegación por pestañas
    return (
        <div className="app-layout">
            <header className="navbar">
                <div className="brand">
                    ZooSystem <span className="badge">{rol}</span>
                </div>
                <nav className="nav-links">
                    <button className={tab === 'zoos' ? 'active' : ''} onClick={() => setTab('zoos')}>
                        Zoológicos
                    </button>
                    <button className={tab === 'especies' ? 'active' : ''} onClick={() => setTab('especies')}>
                        Especies
                    </button>
                    <button className={tab === 'animales' ? 'active' : ''} onClick={() => setTab('animales')}>
                        Animales
                    </button>
                    <button className={tab === 'reportes' ? 'active' : ''} onClick={() => setTab('reportes')}>
                        Reportes y Gráficos
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        Salir
                    </button>
                </nav>
            </header>

            <main className="main-content">
                {tab === 'zoos' && <ZoosManager rol={rol} />}
                {tab === 'especies' && <EspeciesManager rol={rol} />}
                {tab === 'animales' && <AnimalesManager rol={rol} />}
                {tab === 'reportes' && <Reportes />}
            </main>
        </div>
    );
}