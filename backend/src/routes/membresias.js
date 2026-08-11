const express = require('express');
const router = express.Router();
const { 
    getMembresias,
    getMembresiaById,
    createMembresia,
    updateMembresia,
    deleteMembresia
} = require('../controllers/membresiasController');
const { verificarToken, verificarRol } = require('../middleware/auth');

// ========== RUTAS PROTEGIDAS ==========
router.get('/', verificarToken, getMembresias);
router.get('/:id', verificarToken, getMembresiaById);

// Solo administradores pueden crear, actualizar o eliminar membresias
router.post('/', verificarToken, verificarRol(['administrador']), createMembresia);
router.put('/:id', verificarToken, verificarRol(['administrador']), updateMembresia);
router.delete('/:id', verificarToken, verificarRol(['administrador']), deleteMembresia);

module.exports = router;