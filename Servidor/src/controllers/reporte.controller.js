// Implementación de las 20 consultas analíticas e informativas requeridas:


/*
Para implementar los reportes gráficos solicitados 
(gráfico de torta para la cantidad de zoológicos por país y gráfico de barras 
para los 5 zoológicos con mayor presupuesto), dividiremos la solución en dos partes:

El Endpoint Backend que procesa y entrega los datos estructurados en formato JSON.

El Frontend (HTML + JavaScript con Chart.js) que consume la API
 y renderiza las gráficas de manera interactiva.

1. Endpoint en el Backend (src/controllers/reporte.controller.js)
Aseguramos que el controlador de reportes devuelva los datos agrupados 
exactamente como se requiere para las gráficas:

*/

import { pool } from '../config/db.js';

export const reporteController = {
    // 1. Animales por nombre vulgar de especie
    porEspecieNombre: async (req, res) => {
        const { nombre } = req.query;
        const [rows] = await pool.query(`
            SELECT a.codigo,
            a.sexo,
            a.anio_nacimiento,
            a.pais_origen,
            a.continente,
            a.imagen AS animal_imagen,
            e.nombre_vulgar,
            e.nombre_cientifico FROM animales a 
            JOIN especies e ON a.especie_codigo = e.codigo 
            WHERE e.nombre_vulgar LIKE ?`, [`%${nombre}%`]

        );
        res.json(rows);
    },

    // 2. Animales en un zoológico específico
    porZoo: async (req, res) => {
        const { zoo_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM animales WHERE zoo_codigo = ?', [zoo_id]);
        res.json(rows);
    },

    // 3. Animales en peligro de extinción
    enPeligroExtincion: async (req, res) => {
        const [rows] = await pool.query(`
            SELECT a.*, e.nombre_vulgar, e.nombre_cientifico FROM animales a 
            JOIN especies e ON a.especie_codigo = e.codigo 
            WHERE e.peligro_extincion = TRUE`
        );
        res.json(rows);
    },

    // 4. Zoológicos por país
    zoosPorPais: async (req, res) => {
        const { pais } = req.query;
        const [rows] = await pool.query('SELECT * FROM zoos WHERE pais = ?', [pais]);
        res.json(rows);
    },

    // 5. Zoológico con mayor presupuesto y su país
    zooMayorPresupuesto: async (req, res) => {
        const [rows] = await pool.query('SELECT nombre, pais, presupuesto_anual FROM zoos ORDER BY presupuesto_anual DESC LIMIT 1');
        res.json(rows[0]);
    },

    // 6. Zoológicos ordenados por país y ciudad
    zoosOrdenadosPaisCiudad: async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM zoos ORDER BY pais ASC, ciudad ASC');
        res.json(rows);
    },

    // 7. Cantidad de animales pertenecientes a un país
    cantidadAnimalesPorPais: async (req, res) => {
        const { pais } = req.query;
        const [rows] = await pool.query(`
            SELECT COUNT(a.codigo) AS total_animales FROM animales a 
            JOIN zoos z ON a.zoo_codigo = z.codigo 
            WHERE z.pais = ?`, [pais]
        );
        res.json(rows[0]);
    },

    // 8. Animales ordenados por país y continente
    animalesOrdenadosPaisContinente: async (req, res) => {
        const [rows] = await pool.query(`
            SELECT a.*, z.pais AS pais_zoo FROM animales a 
            JOIN zoos z ON a.zoo_codigo = z.codigo 
            ORDER BY z.pais ASC, a.continente ASC`
        );
        res.json(rows);
    },

    // 9. Nombre científico de especie en peligro seleccionada
    nombreCientificoPeligro: async (req, res) => {
        const { nombre_vulgar } = req.query;
        const [rows] = await pool.query('SELECT nombre_cientifico FROM especies WHERE nombre_vulgar = ? AND peligro_extincion = TRUE', [nombre_vulgar]);
        res.json(rows);
    },

    // 10. Nombre vulgar y científico de cada especie
    especiesVulgarCientifico: async (req, res) => {
        const [rows] = await pool.query('SELECT nombre_vulgar, nombre_cientifico FROM especies');
        res.json(rows);
    },

    // 11. Datos completos de zoológicos
    datosCompletosZoos: async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM zoos');
        res.json(rows);
    },

    // 12. Datos completos de animales
    datosCompletosAnimales: async (req, res) => {
        const [rows] = await pool.query(`
            SELECT a.*, z.nombre AS zoo_nombre, e.nombre_vulgar AS especie_nombre 
            FROM animales a 
            JOIN zoos z ON a.zoo_codigo = z.codigo 
            JOIN especies e ON a.especie_codigo = e.codigo`
        );
        res.json(rows);
    },

    // 13. Datos completos de especies
    datosCompletosEspecies: async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM especies');
        res.json(rows);
    },

    // 14. Datos del animal más joven
    animalMasJoven: async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM animales ORDER BY anio_nacimiento DESC LIMIT 1');
        res.json(rows[0]);
    },

    // 15. Cantidad de animales por zoológico
    cantidadAnimalesPorZoo: async (req, res) => {
        const [rows] = await pool.query(`
            SELECT z.nombre AS zoo, COUNT(a.codigo) AS cantidad 
            FROM zoos z 
            LEFT JOIN animales a ON z.codigo = a.zoo_codigo 
            GROUP BY z.codigo`
        );
        res.json(rows);
    },

    // 16. Zoológico de mayor y menor tamaño
    zooMayorMenorTamano: async (req, res) => {
        const [mayor] = await pool.query('SELECT * FROM zoos ORDER BY tamano DESC LIMIT 1');
        const [menor] = await pool.query('SELECT * FROM zoos ORDER BY tamano ASC LIMIT 1');
        res.json({ mayor: mayor[0], menor: menor[0] });
    },

    // 17. Zoológicos ordenados por presupuesto
    zoosOrdenadosPresupuesto: async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM zoos ORDER BY presupuesto_anual DESC');
        res.json(rows);
    },

    // 18. Animales de sexo femenino y masculino por especie
    animalesSexoPorEspecie: async (req, res) => {
        const [rows] = await pool.query(`
            SELECT e.nombre_vulgar, a.sexo, COUNT(a.codigo) AS total 
            FROM animales a 
            JOIN especies e ON a.especie_codigo = e.codigo 
            GROUP BY e.codigo, a.sexo`
        );
        res.json(rows);
    },

    // 19. Presupuesto promedio por zoológico
    presupuestoPromedioZoo: async (req, res) => {
        const [rows] = await pool.query('SELECT AVG(presupuesto_anual) AS presupuesto_promedio FROM zoos');
        res.json(rows[0]);
    },

    // 20. Top 5 zoológicos con mayor presupuesto
    top5ZoosPresupuesto: async (req, res) => {
        const [rows] = await pool.query('SELECT nombre, presupuesto_anual FROM zoos ORDER BY presupuesto_anual DESC LIMIT 5');
        res.json(rows);
    },

    // Datos para gráficos estadísticos
    estadisticasGraficos: async (req, res) => {
        const [paisesZoos] = await pool.query('SELECT pais, COUNT(*) AS cantidad FROM zoos GROUP BY pais');
        const [topZoos] = await pool.query('SELECT nombre, presupuesto_anual FROM zoos ORDER BY presupuesto_anual DESC LIMIT 5');
        res.json({
            graficoTortaPaises: paisesZoos,
            graficoBarrasPresupuesto: topZoos
        });
    }
};


export const obtenerDatosGraficos = async (req, res) => {
    try {
        // 1. Datos para el gráfico de torta: Cantidad de zoológicos por país
        const [paisesZoos] = await pool.query(`
            SELECT pais, COUNT(*) AS cantidad 
            FROM zoos 
            GROUP BY pais
        `);

        // 2. Datos para el gráfico de barras: Top 5 zoológicos con mayor presupuesto
        const [topZoos] = await pool.query(`
            SELECT nombre, presupuesto_anual 
            FROM zoos 
            ORDER BY presupuesto_anual DESC 
            LIMIT 5
        `);

        res.json({
            tortaPaises: {
                labels: paisesZoos.map(row => row.pais),
                data: paisesZoos.map(row => row.cantidad)
            },
            barrasPresupuesto: {
                labels: topZoos.map(row => row.nombre),
                data: topZoos.map(row => row.presupuesto_anual)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};