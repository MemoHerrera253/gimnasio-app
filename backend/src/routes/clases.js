const express = require('express');
const router = express.Router();
const { 
    getClases,
    getClaseById,
    createClase,
    updateClase,
    deleteClase,
    activarClaseController,
    getClasesActivas
} = require('../controllers/clasesController');
const { verificarToken, verificarRol } = require('../middleware/auth');

// ========== RUTAS PROTEGIDAS ==========
router.get('/', verificarToken, getClases);
router.get('/activas', verificarToken, getClasesActivas);
router.get('/:id', verificarToken, getClaseById);

// Solo administradores pueden crear, actualizar o eliminar clases
router.post('/', verificarToken, verificarRol(['administrador']), createClase);
router.put('/:id', verificarToken, verificarRol(['administrador']), updateClase);
router.delete('/:id', verificarToken, verificarRol(['administrador']), deleteClase);
router.patch('/:id/activar', verificarToken, verificarRol(['administrador']), activarClaseController);

module.exports = router;