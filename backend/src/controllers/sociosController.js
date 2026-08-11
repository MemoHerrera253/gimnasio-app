const { 
    obtenerTodos,
    obtenerPorId,
    crearSocio,
    actualizarSocio,
    eliminarSocio,
    reactivarSocio,
    obtenerActivos
} = require('../models/sociosModel');

// ========== OBTENER TODOS LOS SOCIOS ==========
const getSocios = async (req, res) => {
    try {
        console.log('📥 Obteniendo todos los socios');
        const [rows] = await obtenerTodos();
        
        console.log(`✅ Socios encontrados: ${rows.length}`);
        res.json({ 
            mensaje: 'Socios obtenidos correctamente',
            socios: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('❌ Error en getSocios:', err);
        res.status(500).json({ 
            mensaje: 'Error al obtener socios', 
            error: err.message 
        });
    }
};

// ========== OBTENER SOCIO POR ID ==========
const getSocioById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🔍 Buscando socio ID: ${id}`);
        const [rows] = await obtenerPorId(id);
        
        if (!rows || !rows.length) {
            return res.status(404).json({ mensaje: 'Socio no encontrado' });
        }
        
        res.json({ 
            mensaje: 'Socio obtenido correctamente',
            socio: rows[0] 
        });
    } catch (err) {
        console.error('Error en getSocioById:', err);
        res.status(500).json({ mensaje: 'Error al obtener socio', error: err.message });
    }
};

// ========== CREAR SOCIO ==========
const createSocio = async (req, res) => {
    const { nombre, apellido, telefono, correo, fecha_inscripcion, id_membresia } = req.body;
    try {
        console.log(`📝 Creando socio: ${nombre} ${apellido}`);
        
        // Validar campos requeridos
        if (!nombre || !apellido || !telefono || !fecha_inscripcion) {
            return res.status(400).json({ 
                mensaje: 'Faltan campos requeridos: nombre, apellido, telefono, fecha_inscripcion' 
            });
        }
        
        await crearSocio(nombre, apellido, telefono, correo || null, fecha_inscripcion, id_membresia || null);
        res.status(201).json({ mensaje: 'Socio creado correctamente' });
    } catch (err) {
        console.error('Error en createSocio:', err);
        res.status(500).json({ mensaje: 'Error al crear socio', error: err.message });
    }
};

// ========== ACTUALIZAR SOCIO ==========
const updateSocio = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, telefono, correo, fecha_inscripcion, id_membresia } = req.body;
    try {
        console.log(`✏️ Actualizando socio ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Socio no encontrado' });
        }

        await actualizarSocio(id, nombre, apellido, telefono, correo, fecha_inscripcion, id_membresia !== undefined ? (id_membresia || null) : undefined);
        res.json({ mensaje: 'Socio actualizado correctamente' });
    } catch (err) {
        console.error('Error en updateSocio:', err);
        res.status(500).json({ mensaje: 'Error al actualizar socio', error: err.message });
    }
};

// ========== ELIMINAR (DESACTIVAR) SOCIO ==========
const deleteSocio = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🗑️ Desactivando socio ID: ${id}`);
        const [existe] = await obtenerPorId(id);
        if (!existe || !existe.length) {
            return res.status(404).json({ mensaje: 'Socio no encontrado' });
        }

        await eliminarSocio(id);
        res.json({ mensaje: 'Socio desactivado correctamente' });
    } catch (err) {
        console.error('Error en deleteSocio:', err);
        res.status(500).json({ mensaje: 'Error al eliminar socio', error: err.message });
    }
};

// ========== REACTIVAR SOCIO ==========
const reactivarSocioController = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`🔄 Reactivando socio ID: ${id}`);
        await reactivarSocio(id);
        res.json({ mensaje: 'Socio reactivado correctamente' });
    } catch (err) {
        console.error('Error en reactivarSocioController:', err);
        res.status(500).json({ mensaje: 'Error al reactivar socio', error: err.message });
    }
};

// ========== OBTENER SOLO SOCIOS ACTIVOS ==========
const getSociosActivos = async (req, res) => {
    try {
        console.log('📥 Obteniendo socios activos');
        const [rows] = await obtenerActivos();
        res.json({ 
            mensaje: 'Socios activos obtenidos correctamente',
            socios: rows,
            total: rows.length
        });
    } catch (err) {
        console.error('Error en getSociosActivos:', err);
        res.status(500).json({ mensaje: 'Error al obtener socios activos', error: err.message });
    }
};

module.exports = {
    getSocios,
    getSocioById,
    createSocio,
    updateSocio,
    deleteSocio,
    reactivarSocioController,
    getSociosActivos
};