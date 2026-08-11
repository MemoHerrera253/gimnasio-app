const { 
    obtenerTodos,
    obtenerPorId,
    crearMembresia,
    actualizarMembresia,
    eliminarMembresia
} = require('../models/membresiasModel');

// ========== OBTENER TODAS LAS MEMBRESIAS ==========
const getMembresias = async (req, res) => {
    try {
        console.log('📥 Obteniendo todas las membresias');
        const [rows] = await obtenerTodos();
        
        console.log(`✅ Membresias encontradas: ${rows.length}`);
        res.json({ 
            mensaje: 'Membresias obtenidas correctamente',
            membresias: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('❌ Error en getMembresias:', err);
        res.status(500).json({ 
            mensaje: 'Error al obtener membresias', 
            error: err.message 
        });
    }
};

// ========== OBTENER MEMBRESIA POR ID ==========
const getMembresiaById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🔍 Buscando membresia ID: ${id}`);
        const [rows] = await obtenerPorId(id);
        
        if (!rows || !rows.length) {
            return res.status(404).json({ mensaje: 'Membresia no encontrada' });
        }
        
        res.json({ 
            mensaje: 'Membresia obtenida correctamente',
            membresia: rows[0] 
        });
    } catch (err) {
        console.error('Error en getMembresiaById:', err);
        res.status(500).json({ mensaje: 'Error al obtener membresia', error: err.message });
    }
};

// ========== CREAR MEMBRESIA ==========
const createMembresia = async (req, res) => {
    const { nombre, duracion_dias, precio, descripcion } = req.body;
    try {
        console.log(`📝 Creando membresia: ${nombre}`);
        
        if (!nombre || !duracion_dias || !precio) {
            return res.status(400).json({ 
                mensaje: 'Faltan campos requeridos: nombre, duracion_dias, precio' 
            });
        }
        
        await crearMembresia(nombre, duracion_dias, precio, descripcion);
        res.status(201).json({ mensaje: 'Membresia creada correctamente' });
    } catch (err) {
        console.error('Error en createMembresia:', err);
        res.status(500).json({ mensaje: 'Error al crear membresia', error: err.message });
    }
};

// ========== ACTUALIZAR MEMBRESIA ==========
const updateMembresia = async (req, res) => {
    const { id } = req.params;
    const { nombre, duracion_dias, precio, descripcion } = req.body;
    try {
        console.log(`✏️ Actualizando membresia ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Membresia no encontrada' });
        }

        await actualizarMembresia(id, nombre, duracion_dias, precio, descripcion);
        res.json({ mensaje: 'Membresia actualizada correctamente' });
    } catch (err) {
        console.error('Error en updateMembresia:', err);
        res.status(500).json({ mensaje: 'Error al actualizar membresia', error: err.message });
    }
};

// ========== ELIMINAR MEMBRESIA ==========
const deleteMembresia = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🗑️ Eliminando membresia ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Membresia no encontrada' });
        }

        await eliminarMembresia(id);
        res.json({ mensaje: 'Membresia eliminada correctamente' });
    } catch (err) {
        console.error('Error en deleteMembresia:', err);
        res.status(500).json({ mensaje: 'Error al eliminar membresia', error: err.message });
    }
};

module.exports = {
    getMembresias,
    getMembresiaById,
    createMembresia,
    updateMembresia,
    deleteMembresia
};