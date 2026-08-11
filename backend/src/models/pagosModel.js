const db = require('../config/db');

// ========== OBTENER TODOS LOS PAGOS ==========
const obtenerTodos = async () => {
    try {
        const [rows] = await db.query(
            `SELECT p.id_pago, p.id_socio, s.nombre as socio_nombre, s.apellido as socio_apellido, 
                    p.monto, p.fecha_pago, p.metodo, p.id_usuario, u.nombre as usuario_nombre
             FROM pagos p
             JOIN socios s ON p.id_socio = s.id_socio
             JOIN usuarios u ON p.id_usuario = u.id_usuario
             ORDER BY p.fecha_pago DESC`
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerTodos (pagos):', error);
        throw error;
    }
};

// ========== OBTENER PAGO POR ID ==========
const obtenerPorId = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT p.id_pago, p.id_socio, s.nombre as socio_nombre, s.apellido as socio_apellido, 
                    p.monto, p.fecha_pago, p.metodo, p.id_usuario, u.nombre as usuario_nombre
             FROM pagos p
             JOIN socios s ON p.id_socio = s.id_socio
             JOIN usuarios u ON p.id_usuario = u.id_usuario
             WHERE p.id_pago = ?`,
            [id]
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerPorId (pagos):', error);
        throw error;
    }
};

// ========== OBTENER PAGOS POR SOCIO ==========
const obtenerPorSocio = async (id_socio) => {
    try {
        const [rows] = await db.query(
            `SELECT p.id_pago, p.monto, p.fecha_pago, p.metodo, u.nombre as usuario_nombre
             FROM pagos p
             JOIN usuarios u ON p.id_usuario = u.id_usuario
             WHERE p.id_socio = ?
             ORDER BY p.fecha_pago DESC`,
            [id_socio]
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerPorSocio:', error);
        throw error;
    }
};

// ========== CREAR PAGO ==========
const crearPago = async (id_socio, monto, fecha_pago, metodo, id_usuario) => {
    try {
        const [result] = await db.query(
            'INSERT INTO pagos (id_socio, monto, fecha_pago, metodo, id_usuario) VALUES (?, ?, ?, ?, ?)',
            [id_socio, monto, fecha_pago, metodo, id_usuario]
        );
        return result;
    } catch (error) {
        console.error('Error en crearPago:', error);
        throw error;
    }
};

// ========== ACTUALIZAR PAGO ==========
const actualizarPago = async (id, monto, fecha_pago, metodo) => {
    try {
        let query = 'UPDATE pagos SET ';
        const params = [];
        
        if (monto !== undefined) {
            query += 'monto = ?, ';
            params.push(monto);
        }
        if (fecha_pago !== undefined) {
            query += 'fecha_pago = ?, ';
            params.push(fecha_pago);
        }
        if (metodo !== undefined) {
            query += 'metodo = ?, ';
            params.push(metodo);
        }
        
        if (params.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }
        
        query = query.slice(0, -2);
        query += ' WHERE id_pago = ?';
        params.push(id);
        
        const [result] = await db.query(query, params);
        return result;
    } catch (error) {
        console.error('Error en actualizarPago:', error);
        throw error;
    }
};

// ========== ELIMINAR PAGO ==========
const eliminarPago = async (id) => {
    try {
        const [result] = await db.query(
            'DELETE FROM pagos WHERE id_pago = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('Error en eliminarPago:', error);
        throw error;
    }
};

// ========== OBTENER PAGOS POR RANGO DE FECHAS ==========
const obtenerPorRangoFechas = async (fecha_inicio, fecha_fin) => {
    try {
        const [rows] = await db.query(
            `SELECT p.id_pago, s.nombre as socio_nombre, s.apellido as socio_apellido, 
                    p.monto, p.fecha_pago, p.metodo, u.nombre as usuario_nombre
             FROM pagos p
             JOIN socios s ON p.id_socio = s.id_socio
             JOIN usuarios u ON p.id_usuario = u.id_usuario
             WHERE p.fecha_pago BETWEEN ? AND ?
             ORDER BY p.fecha_pago DESC`,
            [fecha_inicio, fecha_fin]
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerPorRangoFechas:', error);
        throw error;
    }
};

// ========== OBTENER TOTAL DE PAGOS POR PERIODO ==========
const obtenerTotalPorPeriodo = async (fecha_inicio, fecha_fin) => {
    try {
        const [rows] = await db.query(
            'SELECT SUM(monto) as total, COUNT(*) as cantidad FROM pagos WHERE fecha_pago BETWEEN ? AND ?',
            [fecha_inicio, fecha_fin]
        );
        return [rows];
    } catch (error) {
        console.error('Error en obtenerTotalPorPeriodo:', error);
        throw error;
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorSocio,
    crearPago,
    actualizarPago,
    eliminarPago,
    obtenerPorRangoFechas,
    obtenerTotalPorPeriodo
};