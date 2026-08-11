const { 
    obtenerTodos,
    obtenerPorId,
    obtenerPorSocio,
    crearPago,
    actualizarPago,
    eliminarPago,
    obtenerPorRangoFechas,
    obtenerTotalPorPeriodo
} = require('../models/pagosModel');

// ========== OBTENER TODOS LOS PAGOS ==========
const getPagos = async (req, res) => {
    try {
        console.log('📥 Obteniendo todos los pagos');
        const [rows] = await obtenerTodos();
        
        console.log(`✅ Pagos encontrados: ${rows.length}`);
        res.json({ 
            mensaje: 'Pagos obtenidos correctamente',
            pagos: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('❌ Error en getPagos:', err);
        res.status(500).json({ 
            mensaje: 'Error al obtener pagos', 
            error: err.message 
        });
    }
};

// ========== OBTENER PAGO POR ID ==========
const getPagoById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🔍 Buscando pago ID: ${id}`);
        const [rows] = await obtenerPorId(id);
        
        if (!rows || !rows.length) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }
        
        res.json({ 
            mensaje: 'Pago obtenido correctamente',
            pago: rows[0] 
        });
    } catch (err) {
        console.error('Error en getPagoById:', err);
        res.status(500).json({ mensaje: 'Error al obtener pago', error: err.message });
    }
};

// ========== OBTENER PAGOS POR SOCIO ==========
const getPagosBySocio = async (req, res) => {
    const { id_socio } = req.params;
    try {
        console.log(`📥 Obteniendo pagos del socio ID: ${id_socio}`);
        const [rows] = await obtenerPorSocio(id_socio);
        
        res.json({ 
            mensaje: 'Pagos del socio obtenidos correctamente',
            pagos: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('Error en getPagosBySocio:', err);
        res.status(500).json({ mensaje: 'Error al obtener pagos del socio', error: err.message });
    }
};

// ========== CREAR PAGO ==========
const createPago = async (req, res) => {
    const { id_socio, monto, fecha_pago, metodo } = req.body;
    const id_usuario = req.usuario.id; // Obtener del token
    try {
        console.log(`📝 Creando pago para socio ID: ${id_socio}`);
        
        if (!id_socio || !monto || !fecha_pago || !metodo) {
            return res.status(400).json({ 
                mensaje: 'Faltan campos requeridos: id_socio, monto, fecha_pago, metodo' 
            });
        }
        
        await crearPago(id_socio, monto, fecha_pago, metodo, id_usuario);
        res.status(201).json({ mensaje: 'Pago creado correctamente' });
    } catch (err) {
        console.error('Error en createPago:', err);
        res.status(500).json({ mensaje: 'Error al crear pago', error: err.message });
    }
};

// ========== ACTUALIZAR PAGO ==========
const updatePago = async (req, res) => {
    const { id } = req.params;
    const { monto, fecha_pago, metodo } = req.body;
    try {
        console.log(`✏️ Actualizando pago ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }

        await actualizarPago(id, monto, fecha_pago, metodo);
        res.json({ mensaje: 'Pago actualizado correctamente' });
    } catch (err) {
        console.error('Error en updatePago:', err);
        res.status(500).json({ mensaje: 'Error al actualizar pago', error: err.message });
    }
};

// ========== ELIMINAR PAGO ==========
const deletePago = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🗑️ Eliminando pago ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }

        await eliminarPago(id);
        res.json({ mensaje: 'Pago eliminado correctamente' });
    } catch (err) {
        console.error('Error en deletePago:', err);
        res.status(500).json({ mensaje: 'Error al eliminar pago', error: err.message });
    }
};

// ========== OBTENER PAGOS POR RANGO DE FECHAS ==========
const getPagosByFecha = async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    try {
        console.log(`📥 Obteniendo pagos desde ${fecha_inicio} hasta ${fecha_fin}`);
        
        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ 
                mensaje: 'Se requieren fecha_inicio y fecha_fin como parámetros' 
            });
        }
        
        const [rows] = await obtenerPorRangoFechas(fecha_inicio, fecha_fin);
        const [total] = await obtenerTotalPorPeriodo(fecha_inicio, fecha_fin);
        
        res.json({ 
            mensaje: 'Pagos por rango de fechas obtenidos correctamente',
            pagos: rows,
            total_pagos: rows.length,
            monto_total: total[0]?.total || 0
        });
    } catch (err) {
        console.error('Error en getPagosByFecha:', err);
        res.status(500).json({ mensaje: 'Error al obtener pagos por fecha', error: err.message });
    }
};

module.exports = {
    getPagos,
    getPagoById,
    getPagosBySocio,
    createPago,
    updatePago,
    deletePago,
    getPagosByFecha
};