const express = require('express');
const router = express.Router();
const { 
    getPagos,
    getPagoById,
    getPagosBySocio,
    createPago,
    updatePago,
    deletePago,
    getPagosByFecha
} = require('../controllers/pagosController');
const { verificarToken, verificarRol } = require('../middleware/auth');

// ========== RUTAS PROTEGIDAS ==========
router.get('/', verificarToken, getPagos);
router.get('/fecha', verificarToken, getPagosByFecha); // ?fecha_inicio=2024-01-01&fecha_fin=2024-12-31
router.get('/socio/:id_socio', verificarToken, getPagosBySocio);
router.get('/:id', verificarToken, getPagoById);

// Solo administradores pueden crear, actualizar o eliminar pagos
router.post('/', verificarToken, verificarRol(['administrador']), createPago);
router.put('/:id', verificarToken, verificarRol(['administrador']), updatePago);
router.delete('/:id', verificarToken, verificarRol(['administrador']), deletePago);

module.exports = router;