const express = require('express');
const router = express.Router();
const { 
    login, 
    registro, 
    getUsuarios, 
    getUsuarioById, 
    createUsuario, 
    updateUsuario, 
    deleteUsuario,
    getUsuariosActivos,
    reactivarUsuarioController
} = require('../controllers/usuariosController');
const { verificarToken, verificarRol } = require('../middleware/auth');

// ========== RUTAS PÚBLICAS ==========
router.post('/login', login);
router.post('/registro', registro);

// ========== RUTAS PROTEGIDAS ==========
router.get('/', verificarToken, getUsuarios);
router.get('/activos', verificarToken, getUsuariosActivos);
router.get('/:id', verificarToken, getUsuarioById);

// Solo administradores pueden crear, actualizar o eliminar
router.post('/', verificarToken, verificarRol(['administrador']), createUsuario);
router.put('/:id', verificarToken, verificarRol(['administrador']), updateUsuario);
router.delete('/:id', verificarToken, verificarRol(['administrador']), deleteUsuario);
router.patch('/:id/reactivar', verificarToken, verificarRol(['administrador']), reactivarUsuarioController);

module.exports = router;