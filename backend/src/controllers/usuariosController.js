const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
    buscarPorCorreo, 
    crearUsuario, 
    obtenerTodos, 
    obtenerPorId, 
    actualizarUsuario, 
    eliminarUsuario,
    reactivarUsuario,
    obtenerActivos
} = require('../models/usuariosModel');

// ========== AUTENTICACIÓN ==========
const login = async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        console.log(`🔐 Intento de login: ${correo}`);
        const [rows] = await buscarPorCorreo(correo);
        
        if (!rows || !rows.length) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const usuario = rows[0];
        
        // Verificar si el usuario está activo
        if (usuario.activo === 0) {
            return res.status(401).json({ mensaje: 'Usuario inactivo, contacte al administrador' });
        }
        
        // ✅ Usando "contrasena" (sin acento)
        const valido = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!valido) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        
        res.json({ 
            token, 
            rol: usuario.rol, 
            nombre: usuario.nombre,
            id: usuario.id_usuario
        });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ mensaje: 'Error del servidor', error: err.message });
    }
};

const registro = async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;
    try {
        console.log(`📝 Registrando usuario: ${correo}`);
        const [existe] = await buscarPorCorreo(correo);
        if (existe && existe.length) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        const hash = await bcrypt.hash(contrasena, 10);
        await crearUsuario(nombre, correo, hash, rol || 'recepcionista');
        res.status(201).json({ mensaje: 'Usuario creado correctamente' });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ mensaje: 'Error al crear usuario', error: err.message });
    }
};

// ========== CRUD DE USUARIOS ==========
const getUsuarios = async (req, res) => {
    try {
        console.log('📥 Obteniendo todos los usuarios');
        const [rows] = await obtenerTodos();
        
        console.log(`✅ Usuarios encontrados: ${rows.length}`);
        res.json({ 
            mensaje: 'Usuarios obtenidos correctamente',
            usuarios: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('❌ Error en getUsuarios:', err);
        res.status(500).json({ 
            mensaje: 'Error al obtener usuarios', 
            error: err.message 
        });
    }
};

const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🔍 Buscando usuario ID: ${id}`);
        const [rows] = await obtenerPorId(id);
        
        if (!rows || !rows.length) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        res.json({ 
            mensaje: 'Usuario obtenido correctamente',
            usuario: rows[0] 
        });
    } catch (err) {
        console.error('Error en getUsuarioById:', err);
        res.status(500).json({ mensaje: 'Error al obtener usuario', error: err.message });
    }
};

const createUsuario = async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;
    try {
        console.log(`📝 Creando usuario: ${correo}`);
        const [existe] = await buscarPorCorreo(correo);
        if (existe && existe.length) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        const hash = await bcrypt.hash(contrasena, 10);
        await crearUsuario(nombre, correo, hash, rol || 'recepcionista');
        res.status(201).json({ mensaje: 'Usuario creado correctamente' });
    } catch (err) {
        console.error('Error en createUsuario:', err);
        res.status(500).json({ mensaje: 'Error al crear usuario', error: err.message });
    }
};

const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, contrasena, rol } = req.body;
    try {
        console.log(`✏️ Actualizando usuario ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        let hash = undefined;
        if (contrasena) {
            hash = await bcrypt.hash(contrasena, 10);
        }

        await actualizarUsuario(id, nombre, correo, hash, rol);
        res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (err) {
        console.error('Error en updateUsuario:', err);
        res.status(500).json({ mensaje: 'Error al actualizar usuario', error: err.message });
    }
};

const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🗑️ Eliminando (desactivando) usuario ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        await eliminarUsuario(id);
        res.json({ mensaje: 'Usuario desactivado correctamente' });
    } catch (err) {
        console.error('Error en deleteUsuario:', err);
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error: err.message });
    }
};

const getUsuariosActivos = async (req, res) => {
    try {
        console.log('📥 Obteniendo usuarios activos');
        const [rows] = await obtenerActivos();
        res.json({ 
            mensaje: 'Usuarios activos obtenidos correctamente',
            usuarios: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('Error en getUsuariosActivos:', err);
        res.status(500).json({ mensaje: 'Error al obtener usuarios activos', error: err.message });
    }
};

const reactivarUsuarioController = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🔄 Reactivando usuario ID: ${id}`);
        await reactivarUsuario(id);
        res.json({ mensaje: 'Usuario reactivado correctamente' });
    } catch (err) {
        console.error('Error en reactivarUsuarioController:', err);
        res.status(500).json({ mensaje: 'Error al reactivar usuario', error: err.message });
    }
};

module.exports = {
    login,
    registro,
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuariosActivos,
    reactivarUsuarioController
};