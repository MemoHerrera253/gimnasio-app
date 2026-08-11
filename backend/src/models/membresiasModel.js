const db = require('../config/db');

// ========== OBTENER TODAS LAS MEMBRESIAS ==========
const obtenerTodos = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_membresia, nombre, duracion_dias, precio, descripcion FROM membresias ORDER BY id_membresia DESC'
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerTodos (membresias):', error);
        throw error;
    }
};

// ========== OBTENER MEMBRESIA POR ID ==========
const obtenerPorId = async (id) => {
    try {
        const [rows] = await db.query(
            'SELECT id_membresia, nombre, duracion_dias, precio, descripcion FROM membresias WHERE id_membresia = ?',
            [id]
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerPorId (membresias):', error);
        throw error;
    }
};

// ========== CREAR MEMBRESIA ==========
const crearMembresia = async (nombre, duracion_dias, precio, descripcion) => {
    try {
        const [result] = await db.query(
            'INSERT INTO membresias (nombre, duracion_dias, precio, descripcion) VALUES (?, ?, ?, ?)',
            [nombre, duracion_dias, precio, descripcion || null]
        );
        return result;
    } catch (error) {
        console.error('Error en crearMembresia:', error);
        throw error;
    }
};

// ========== ACTUALIZAR MEMBRESIA ==========
const actualizarMembresia = async (id, nombre, duracion_dias, precio, descripcion) => {
    try {
        let query = 'UPDATE membresias SET ';
        const params = [];
        
        if (nombre !== undefined) {
            query += 'nombre = ?, ';
            params.push(nombre);
        }
        if (duracion_dias !== undefined) {
            query += 'duracion_dias = ?, ';
            params.push(duracion_dias);
        }
        if (precio !== undefined) {
            query += 'precio = ?, ';
            params.push(precio);
        }
        if (descripcion !== undefined) {
            query += 'descripcion = ?, ';
            params.push(descripcion);
        }
        
        if (params.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }
        
        query = query.slice(0, -2);
        query += ' WHERE id_membresia = ?';
        params.push(id);
        
        const [result] = await db.query(query, params);
        return result;
    } catch (error) {
        console.error('Error en actualizarMembresia:', error);
        throw error;
    }
};

// ========== ELIMINAR MEMBRESIA ==========
const eliminarMembresia = async (id) => {
    try {
        const [result] = await db.query(
            'DELETE FROM membresias WHERE id_membresia = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('Error en eliminarMembresia:', error);
        throw error;
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crearMembresia,
    actualizarMembresia,
    eliminarMembresia
};