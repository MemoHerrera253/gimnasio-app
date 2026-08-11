const db = require('../config/db');

// ========== OBTENER TODAS LAS CLASES ==========
const obtenerTodos = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_clase, nombre, instructor, horario, capacidad, activa FROM clases ORDER BY id_clase DESC'
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerTodos (clases):', error);
        throw error;
    }
};

// ========== OBTENER CLASE POR ID ==========
const obtenerPorId = async (id) => {
    try {
        const [rows] = await db.query(
            'SELECT id_clase, nombre, instructor, horario, capacidad, activa FROM clases WHERE id_clase = ?',
            [id]
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerPorId (clases):', error);
        throw error;
    }
};

// ========== CREAR CLASE ==========
const crearClase = async (nombre, instructor, horario, capacidad) => {
    try {
        const [result] = await db.query(
            'INSERT INTO clases (nombre, instructor, horario, capacidad, activa) VALUES (?, ?, ?, ?, 1)',
            [nombre, instructor, horario, capacidad]
        );
        return result;
    } catch (error) {
        console.error('Error en crearClase:', error);
        throw error;
    }
};

// ========== ACTUALIZAR CLASE ==========
const actualizarClase = async (id, nombre, instructor, horario, capacidad) => {
    try {
        let query = 'UPDATE clases SET ';
        const params = [];
        
        if (nombre !== undefined) {
            query += 'nombre = ?, ';
            params.push(nombre);
        }
        if (instructor !== undefined) {
            query += 'instructor = ?, ';
            params.push(instructor);
        }
        if (horario !== undefined) {
            query += 'horario = ?, ';
            params.push(horario);
        }
        if (capacidad !== undefined) {
            query += 'capacidad = ?, ';
            params.push(capacidad);
        }
        
        if (params.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }
        
        query = query.slice(0, -2);
        query += ' WHERE id_clase = ?';
        params.push(id);
        
        const [result] = await db.query(query, params);
        return result;
    } catch (error) {
        console.error('Error en actualizarClase:', error);
        throw error;
    }
};

// ========== DESACTIVAR CLASE ==========
const desactivarClase = async (id) => {
    try {
        const [result] = await db.query(
            'UPDATE clases SET activa = 0 WHERE id_clase = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('Error en desactivarClase:', error);
        throw error;
    }
};

// ========== ACTIVAR CLASE ==========
const activarClase = async (id) => {
    try {
        const [result] = await db.query(
            'UPDATE clases SET activa = 1 WHERE id_clase = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('Error en activarClase:', error);
        throw error;
    }
};

// ========== OBTENER CLASES ACTIVAS ==========
const obtenerActivas = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_clase, nombre, instructor, horario, capacidad FROM clases WHERE activa = 1 ORDER BY nombre'
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerActivas (clases):', error);
        throw error;
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crearClase,
    actualizarClase,
    desactivarClase,
    activarClase,
    obtenerActivas
};