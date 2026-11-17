import { Router } from 'express';
import { obtenerDatosGraficos, reporteController } from '../controllers/reporte.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint específico para alimentar los gráficos (torta y barras)
router.get('/graficos', verificarToken, obtenerDatosGraficos);


// Todas las consultas analíticas y reportes protegidos con JWT
router.get('/por-especie-nombre', verificarToken, reporteController.porEspecieNombre);
router.get('/por-zoo/:zoo_id', verificarToken, reporteController.porZoo);
router.get('/peligro-extincion', verificarToken, reporteController.enPeligroExtincion);
router.get('/zoos-pais', verificarToken, reporteController.zoosPorPais);
router.get('/zoo-mayor-presupuesto', verificarToken, reporteController.zooMayorPresupuesto);
router.get('/zoos-ordenados-pais-ciudad', verificarToken, reporteController.zoosOrdenadosPaisCiudad);
router.get('/cantidad-animales-pais', verificarToken, reporteController.cantidadAnimalesPorPais);
router.get('/animales-ordenados-pais-continente', verificarToken, reporteController.animalesOrdenadosPaisContinente);
router.get('/cientifico-peligro', verificarToken, reporteController.nombreCientificoPeligro);
router.get('/especies-nombres', verificarToken, reporteController.especiesVulgarCientifico);
router.get('/completos-zoos', verificarToken, reporteController.datosCompletosZoos);
router.get('/completos-animales', verificarToken, reporteController.datosCompletosAnimales);
router.get('/completos-especies', verificarToken, reporteController.datosCompletosEspecies);
router.get('/animal-mas-joven', verificarToken, reporteController.animalMasJoven);
router.get('/cantidad-por-zoo', verificarToken, reporteController.cantidadAnimalesPorZoo);
router.get('/mayor-menor-tamano', verificarToken, reporteController.zooMayorMenorTamano);
router.get('/zoos-ordenados-presupuesto', verificarToken, reporteController.zoosOrdenadosPresupuesto);
router.get('/sexo-por-especie', verificarToken, reporteController.animalesSexoPorEspecie);
router.get('/presupuesto-promedio', verificarToken, reporteController.presupuestoPromedioZoo);
router.get('/top-5-presupuesto', verificarToken, reporteController.top5ZoosPresupuesto);

// Endpoint específico para alimentar los gráficos (torta y barras)
//router.get('/graficos', verificarToken, reporteController.estadisticasGraficos);




export default router;
