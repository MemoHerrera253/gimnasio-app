const { 
    obtenerTodos,
    obtenerPorId,
    crearClase,
    actualizarClase,
    desactivarClase,
    activarClase,
    obtenerActivas
} = require('../models/clasesModel');

// ========== OBTENER TODAS LAS CLASES ==========
const getClases = async (req, res) => {
    try {
        console.log('📥 Obteniendo todas las clases');
        const [rows] = await obtenerTodos();
        
        console.log(`✅ Clases encontradas: ${rows.length}`);
        res.json({ 
            mensaje: 'Clases obtenidas correctamente',
            clases: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('❌ Error en getClases:', err);
        res.status(500).json({ 
            mensaje: 'Error al obtener clases', 
            error: err.message 
        });
    }
};

// ========== OBTENER CLASE POR ID ==========
const getClaseById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🔍 Buscando clase ID: ${id}`);
        const [rows] = await obtenerPorId(id);
        
        if (!rows || !rows.length) {
            return res.status(404).json({ mensaje: 'Clase no encontrada' });
        }
        
        res.json({ 
            mensaje: 'Clase obtenida correctamente',
            clase: rows[0] 
        });
    } catch (err) {
        console.error('Error en getClaseById:', err);
        res.status(500).json({ mensaje: 'Error al obtener clase', error: err.message });
    }
};

// ========== CREAR CLASE ==========
const createClase = async (req, res) => {
    const { nombre, instructor, horario, capacidad } = req.body;
    try {
        console.log(`📝 Creando clase: ${nombre}`);
        
        if (!nombre || !instructor || !horario || !capacidad) {
            return res.status(400).json({ 
                mensaje: 'Faltan campos requeridos: nombre, instructor, horario, capacidad' 
            });
        }
        
        await crearClase(nombre, instructor, horario, capacidad);
        res.status(201).json({ mensaje: 'Clase creada correctamente' });
    } catch (err) {
        console.error('Error en createClase:', err);
        res.status(500).json({ mensaje: 'Error al crear clase', error: err.message });
    }
};

// ========== ACTUALIZAR CLASE ==========
const updateClase = async (req, res) => {
    const { id } = req.params;
    const { nombre, instructor, horario, capacidad } = req.body;
    try {
        console.log(`✏️ Actualizando clase ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Clase no encontrada' });
        }

        await actualizarClase(id, nombre, instructor, horario, capacidad);
        res.json({ mensaje: 'Clase actualizada correctamente' });
    } catch (err) {
        console.error('Error en updateClase:', err);
        res.status(500).json({ mensaje: 'Error al actualizar clase', error: err.message });
    }
};

// ========== DESACTIVAR CLASE ==========
const deleteClase = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🗑️ Desactivando clase ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Clase no encontrada' });
        }

        await desactivarClase(id);
        res.json({ mensaje: 'Clase desactivada correctamente' });
    } catch (err) {
        console.error('Error en deleteClase:', err);
        res.status(500).json({ mensaje: 'Error al desactivar clase', error: err.message });
    }
};

// ========== ACTIVAR CLASE ==========
const activarClaseController = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🔄 Activando clase ID: ${id}`);
        await activarClase(id);
        res.json({ mensaje: 'Clase activada correctamente' });
    } catch (err) {
        console.error('Error en activarClaseController:', err);
        res.status(500).json({ mensaje: 'Error al activar clase', error: err.message });
    }
};

// ========== OBTENER SOLO CLASES ACTIVAS ==========
const getClasesActivas = async (req, res) => {
    try {
        console.log('📥 Obteniendo clases activas');
        const [rows] = await obtenerActivas();
        res.json({ 
            mensaje: 'Clases activas obtenidas correctamente',
            clases: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('Error en getClasesActivas:', err);
        res.status(500).json({ mensaje: 'Error al obtener clases activas', error: err.message });
    }
};

module.exports = {
    getClases,
    getClaseById,
    createClase,
    updateClase,
    deleteClase,
    activarClaseController,
    getClasesActivas
};