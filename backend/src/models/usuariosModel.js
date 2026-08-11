const db = require('../config/db');

// ========== FUNCIONES DE AUTENTICACIÓN ==========
const buscarPorCorreo = async (correo) => {
    try {
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, contrasena, rol, activo, creado_en FROM usuarios WHERE correo = ?',
            [correo]
        );
        return [rows];
    } catch (error) {
        console.error('Error en buscarPorCorreo:', error);
        throw error;
    }
};

const crearUsuario = async (nombre, correo, contrasena, rol) => {
    try {
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, rol, activo, creado_en) VALUES (?, ?, ?, ?, 1, NOW())',
            [nombre, correo, contrasena, rol]
        );
        return result;
    } catch (error) {
        console.error('Error en crearUsuario:', error);
        throw error;
    }
};

// ========== FUNCIONES CRUD ==========
const obtenerTodos = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, rol, activo, creado_en FROM usuarios ORDER BY id_usuario DESC'
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerTodos:', error);
        throw error;
    }
};

const obtenerPorId = async (id) => {
    try {
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, rol, activo, creado_en FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerPorId:', error);
        throw error;
    }
};

const actualizarUsuario = async (id, nombre, correo, contrasena, rol) => {
    try {
        let query = 'UPDATE usuarios SET ';
        const params = [];
        
        if (nombre !== undefined) {
            query += 'nombre = ?, ';
            params.push(nombre);
        }
        if (correo !== undefined) {
            query += 'correo = ?, ';
            params.push(correo);
        }
        if (contrasena) {
            query += 'contrasena = ?, ';
            params.push(contrasena);
        }
        if (rol !== undefined) {
            query += 'rol = ?, ';
            params.push(rol);
        }
        
        if (params.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }
        
        query = query.slice(0, -2);
        query += ' WHERE id_usuario = ?';
        params.push(id);
        
        const [result] = await db.query(query, params);
        return result;
    } catch (error) {
        console.error('Error en actualizarUsuario:', error);
        throw error;
    }
};

const eliminarUsuario = async (id) => {
    try {
        const [result] = await db.query(
            'UPDATE usuarios SET activo = 0 WHERE id_usuario = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('Error en eliminarUsuario:', error);
        throw error;
    }
};

const reactivarUsuario = async (id) => {
    try {
        const [result] = await db.query(
            'UPDATE usuarios SET activo = 1 WHERE id_usuario = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('Error en reactivarUsuario:', error);
        throw error;
    }
};

const obtenerActivos = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, rol, creado_en FROM usuarios WHERE activo = 1 ORDER BY nombre'
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerActivos:', error);
        throw error;
    }
};

module.exports = {
    buscarPorCorreo,
    crearUsuario,
    obtenerTodos,
    obtenerPorId,
    actualizarUsuario,
    eliminarUsuario,
    reactivarUsuario,
    obtenerActivos
};