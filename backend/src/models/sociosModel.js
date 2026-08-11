const db = require('../config/db');

// ========== OBTENER TODOS LOS SOCIOS ==========
const obtenerTodos = async () => {
    try {
        const [rows] = await db.query(
            `SELECT s.id_socio, s.nombre, s.apellido, s.telefono, s.correo, s.fecha_inscripcion, s.activo, s.id_membresia, 
                    m.nombre AS nombre_membresia, m.precio AS precio_membresia 
             FROM socios s
             LEFT JOIN membresias m ON s.id_membresia = m.id_membresia
             ORDER BY s.id_socio DESC`
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerTodos (socios):', error);
        throw error;
    }
};

// ========== OBTENER SOCIO POR ID ==========
const obtenerPorId = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT s.id_socio, s.nombre, s.apellido, s.telefono, s.correo, s.fecha_inscripcion, s.activo, s.id_membresia, 
                    m.nombre AS nombre_membresia, m.precio AS precio_membresia 
             FROM socios s
             LEFT JOIN membresias m ON s.id_membresia = m.id_membresia
             WHERE s.id_socio = ?`,
            [id]
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerPorId (socios):', error);
        throw error;
    }
};

// ========== CREAR SOCIO ==========
const crearSocio = async (nombre, apellido, telefono, correo, fecha_inscripcion, id_membresia) => {
    try {
        const [result] = await db.query(
            'INSERT INTO socios (nombre, apellido, telefono, correo, fecha_inscripcion, id_membresia, activo) VALUES (?, ?, ?, ?, ?, ?, 1)',
            [nombre, apellido, telefono, correo, fecha_inscripcion, id_membresia || null]
        );
        return result;
    } catch (error) {
        console.error('Error en crearSocio:', error);
        throw error;
    }
};

// ========== ACTUALIZAR SOCIO ==========
const actualizarSocio = async (id, nombre, apellido, telefono, correo, fecha_inscripcion, id_membresia) => {
    try {
        let query = 'UPDATE socios SET ';
        const params = [];
        
        if (nombre !== undefined) {
            query += 'nombre = ?, ';
            params.push(nombre);
        }
        if (apellido !== undefined) {
            query += 'apellido = ?, ';
            params.push(apellido);
        }
        if (telefono !== undefined) {
            query += 'telefono = ?, ';
            params.push(telefono);
        }
        if (correo !== undefined) {
            query += 'correo = ?, ';
            params.push(correo);
        }
        if (fecha_inscripcion !== undefined) {
            query += 'fecha_inscripcion = ?, ';
            params.push(fecha_inscripcion);
        }
        if (id_membresia !== undefined) {
            query += 'id_membresia = ?, ';
            params.push(id_membresia);
        }
        
        if (params.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }
        
        query = query.slice(0, -2);
        query += ' WHERE id_socio = ?';
        params.push(id);
        
        const [result] = await db.query(query, params);
        return result;
    } catch (error) {
        console.error('Error en actualizarSocio:', error);
        throw error;
    }
};

// ========== ELIMINAR (DESACTIVAR) SOCIO ==========
const eliminarSocio = async (id) => {
    try {
        const [result] = await db.query(
            'UPDATE socios SET activo = 0 WHERE id_socio = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('Error en eliminarSocio:', error);
        throw error;
    }
};

// ========== REACTIVAR SOCIO ==========
const reactivarSocio = async (id) => {
    try {
        const [result] = await db.query(
            'UPDATE socios SET activo = 1 WHERE id_socio = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('Error en reactivarSocio:', error);
        throw error;
    }
};

// ========== OBTENER SOCIOS ACTIVOS ==========
const obtenerActivos = async () => {
    try {
        const [rows] = await db.query(
            `SELECT s.id_socio, s.nombre, s.apellido, s.telefono, s.correo, s.fecha_inscripcion, s.id_membresia, 
                    m.nombre AS nombre_membresia, m.precio AS precio_membresia 
             FROM socios s
             LEFT JOIN membresias m ON s.id_membresia = m.id_membresia
             WHERE s.activo = 1 
             ORDER BY s.nombre`
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerActivos (socios):', error);
        throw error;
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crearSocio,
    actualizarSocio,
    eliminarSocio,
    reactivarSocio,
    obtenerActivos
};