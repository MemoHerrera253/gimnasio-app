const express = require('express');
const router = express.Router();
const { 
    getSocios,
    getSocioById,
    createSocio,
    updateSocio,
    deleteSocio,
    reactivarSocioController,
    getSociosActivos
} = require('../controllers/sociosController');
const { verificarToken, verificarRol } = require('../middleware/auth');

// ========== RUTAS PROTEGIDAS (requieren token) ==========
router.get('/', verificarToken, getSocios);
router.get('/activos', verificarToken, getSociosActivos);
router.get('/:id', verificarToken, getSocioById);

// Rutas que solo administradores pueden usar
router.post('/', verificarToken, verificarRol(['administrador']), createSocio);
router.put('/:id', verificarToken, verificarRol(['administrador']), updateSocio);
router.delete('/:id', verificarToken, verificarRol(['administrador']), deleteSocio);
router.patch('/:id/reactivar', verificarToken, verificarRol(['administrador']), reactivarSocioController);

module.exports = router;