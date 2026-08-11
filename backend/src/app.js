const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ========== RUTAS PÚBLICAS ==========
// ✅ Ruta raíz
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Gimnasio funcionando correctamente',
        version: '1.0.0',
        estado: '🟢 Online'
    });
});

// ✅ Ruta de información de la API
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API del Gimnasio',
        endpoints: {
            usuarios: '/api/usuarios',
            socios: '/api/socios (requiere autenticación)',
            membresias: '/api/membresias (requiere autenticación)',
            pagos: '/api/pagos (requiere autenticación)',
            clases: '/api/clases (requiere autenticación)'
        }
    });
});

// ========== RUTAS DE LA API ==========
// ✅ IMPORTANTE: Usamos app.use() para los routers
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/socios', require('./routes/socios'));
app.use('/api/membresias', require('./routes/membresias'));
app.use('/api/pagos', require('./routes/pagos'));
app.use('/api/clases', require('./routes/clases'));

// ========== MANEJO DE ERRORES 404 ==========
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        mensaje: `La ruta ${req.originalUrl} no existe en la API`,
        sugerencia: 'Revisa los endpoints disponibles en /api'
    });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════');
    console.log('🚀 Servidor iniciado exitosamente');
    console.log(`📍 Local:   http://localhost:${PORT}`);
    console.log(`📍 API:     http://localhost:${PORT}/api`);
    console.log('═══════════════════════════════════════');
    console.log('📋 Endpoints disponibles:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/api`);
    console.log(`   GET  http://localhost:${PORT}/api/usuarios`);
    console.log(`   GET  http://localhost:${PORT}/api/socios (requiere token)`);
    console.log('═══════════════════════════════════════\n');
});