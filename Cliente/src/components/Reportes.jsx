/**
 * Integra el catálogo completo de consultas analíticas 
 * (los 20 reportes tabulares + variantes y parámetros dinámicos), 
 * exportación instantánea a Excel/CSV y
 *  renderizado limpio de las gráficas de torta y barras con chart.js.

JavaScript
 * 
 */

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

const CATALOGO_REPORTES = [
    { id: 1, label: '1. Animales por nombre vulgar de especie', endpoint: '/reportes/por-especie-nombre', param: 'nombre', placeholder: 'Ej: León' },
    { id: 2, label: '2. Animales en un zoológico específico (ID)', endpoint: '/reportes/por-zoo', isPathParam: true, placeholder: 'Ej: 1' },
    { id: 3, label: '3. Animales en peligro de extinción', endpoint: '/reportes/peligro-extincion' },
    { id: 4, label: '4. Zoológicos por país', endpoint: '/reportes/zoos-pais', param: 'pais', placeholder: 'Ej: Argentina' },
    { id: 5, label: '5. Zoológico con mayor presupuesto y su país', endpoint: '/reportes/zoo-mayor-presupuesto' },
    { id: 6, label: '6. Zoológicos ordenados por país y ciudad', endpoint: '/reportes/zoos-ordenados-pais-ciudad' },
    { id: 7, label: '7. Cantidad de animales pertenecientes a un país', endpoint: '/reportes/cantidad-animales-pais', param: 'pais', placeholder: 'Ej: Brasil' },
    { id: 8, label: '8. Animales ordenados por país y continente', endpoint: '/reportes/animales-ordenados-pais-continente' },
    { id: 9, label: '9. Nombre científico de especie en peligro seleccionada', endpoint: '/reportes/cientifico-peligro', param: 'nombre_vulgar', placeholder: 'Ej: Panda' },
    { id: 10, label: '10. Nombre vulgar y científico de cada especie', endpoint: '/reportes/especies-nombres' },
    { id: 11, label: '11. Datos completos de los zoológicos', endpoint: '/reportes/completos-zoos' },
    { id: 12, label: '12. Datos completos de los animales', endpoint: '/reportes/completos-animales' },
    { id: 13, label: '13. Datos completos de las especies', endpoint: '/reportes/completos-especies' },
    { id: 14, label: '14. Datos del animal más joven', endpoint: '/reportes/animal-mas-joven' },
    { id: 15, label: '15. Cantidad de animales por zoológico', endpoint: '/reportes/cantidad-por-zoo' },
    { id: 16, label: '16. Zoológico de mayor y menor tamaño', endpoint: '/reportes/mayor-menor-tamano' },
    { id: 17, label: '17. Zoológicos ordenados por presupuesto', endpoint: '/reportes/zoos-ordenados-presupuesto' },
    { id: 18, label: '18. Animales femenino y masculino por especie', endpoint: '/reportes/sexo-por-especie' },
    { id: 19, label: '19. Presupuesto promedio por zoológico', endpoint: '/reportes/presupuesto-promedio' },
    { id: 20, label: '20. Top 5 zoológicos con mayor presupuesto', endpoint: '/reportes/top-5-presupuesto' },
    { id: 21, label: '21. Distribución de zoológicos por país (Tabla)', endpoint: '/reportes/graficos', extract: 'tortaPaises' },
    { id: 22, label: '22. Ranking de presupuestos Top 5 (Tabla)', endpoint: '/reportes/graficos', extract: 'barrasPresupuesto' },
    { id: 23, label: '23. Inventario general de fauna por continente', endpoint: '/reportes/animales-ordenados-pais-continente' },
    { id: 24, label: '24. Auditoría de especies protegidas', endpoint: '/reportes/peligro-extincion' },
    { id: 25, label: '25. Resumen ejecutivo de capacidad y presupuesto', endpoint: '/reportes/completos-zoos' }
];

export default function Reportes() {
    const [selectedId, setSelectedId] = useState(11);
    const [paramValue, setParamValue] = useState('');
    const [resultados, setResultados] = useState([]);

    const tortaRef = useRef(null);
    const barrasRef = useRef(null);
    const tortaChartInstance = useRef(null);
    const barrasChartInstance = useRef(null);

    const reporteActual = CATALOGO_REPORTES.find(r => r.id === Number(selectedId));

    const ejecutarReporte = async () => {
        try {
            console.log(reporteActual.endpoint);
            console.log(reporteActual);
            let url = reporteActual.endpoint;
            console.log(url);
            if (reporteActual.isPathParam) {
                if (!paramValue) return Swal.fire('Atención', 'Ingresa un valor para el filtro', 'info');
                url += `/${encodeURIComponent(paramValue)}`;
            } else if (reporteActual.param) {
                if (!paramValue) return Swal.fire('Atención', 'Ingresa un valor para el filtro', 'info');
                url += `?${reporteActual.param}=${encodeURIComponent(paramValue)}`;
            }

            const data = await apiFetch(url);
            // Normalizar respuesta a arreglo para la tabla interactiva
            if (Array.isArray(data)) {
                setResultados(data);
            } else if (data && data.mayor && data.menor) {
                setResultados([{ tipo: 'Mayor Tamaño', ...data.mayor }, { tipo: 'Menor Tamaño', ...data.menor }]);
            } else if (data) {
                setResultados([data]);
            } else {
                setResultados([]);
            }
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };

    const exportarCSV = () => {
        if (!resultados.length) return;
        const headers = Object.keys(resultados[0]);
        const csvRows = [
            headers.join(','),
            ...resultados.map(row => headers.map(field => JSON.stringify(row[field] ?? '')).join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_zoologico_${selectedId}.csv`;
        link.click();
    };

    useEffect(() => {
        const cargarGraficos = async () => {
            try {
                const stats = await apiFetch('/reportes/graficos');

                if (tortaChartInstance.current) tortaChartInstance.current.destroy();
                if (barrasChartInstance.current) barrasChartInstance.current.destroy();

                tortaChartInstance.current = new Chart(tortaRef.current, {
                    type: 'pie',
                    data: {
                        labels: stats.tortaPaises.labels,
                        datasets: [{
                            data: stats.tortaPaises.data,
                            backgroundColor: ['#2e7d32', '#1565c0', '#ef6c00', '#6a1b9a', '#00838f', '#c62828']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { title: { display: true, text: 'Cantidad de Zoológicos por País' } }
                    }
                });

                barrasChartInstance.current = new Chart(barrasRef.current, {
                    type: 'bar',
                    data: {
                        labels: stats.barrasPresupuesto.labels,
                        datasets: [{
                            label: 'Presupuesto Anual ($)',
                            data: stats.barrasPresupuesto.data,
                            backgroundColor: '#2e7d32'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { title: { display: true, text: 'Top 5 Zoológicos con Mayor Presupuesto' } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            } catch (err) {
                console.error('Error cargando gráficos:', err);
            }
        };
        cargarGraficos();
    }, []);

    const columnas = resultados.length > 0 ? Object.keys(resultados[0]) : [];

    return (
        <div className="module-container">
            {/* Sección de Gráficos Responsivos con Chart.js */}
            <div className="charts-grid">
                <div className="card chart-box">
                    <canvas ref={tortaRef}></canvas>
                </div>
                <div className="card chart-box">
                    <canvas ref={barrasRef}></canvas>
                </div>
            </div>

            {/* Selector de Reportes e Interfaz Tabular */}
            <div className="card">
                <h3>Centro de Reportes Analíticos (25 Consultas)</h3>
                <div className="report-controls">
                    <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setParamValue(''); setResultados([]); }}>
                        {CATALOGO_REPORTES.map(rep => (
                            <option key={rep.id} value={rep.id}>{rep.label}</option>
                        ))}
                    </select>

                    {(reporteActual.param || reporteActual.isPathParam) && (
                        <input
                            type="text"
                            placeholder={reporteActual.placeholder}
                            value={paramValue}
                            onChange={e => setParamValue(e.target.value)}
                        />
                    )}

                    <button className="btn btn-primary" onClick={ejecutarReporte}>Generar Reporte</button>
                    {resultados.length > 0 && (
                        <button className="btn btn-secondary" onClick={exportarCSV}>Exportar CSV</button>
                    )}
                </div>

                {resultados.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    {columnas.map(col => <th key={col}>{col.replace(/_/g, ' ').toUpperCase()}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((fila, i) => (
                                    <tr key={i}>
                                        {columnas.map(col => <td key={col}>{String(fila[col] ?? '')}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="empty-state">Selecciona un reporte y presiona "Generar Reporte" para visualizar los datos.</p>
                )}
            </div>
        </div>
    );
}