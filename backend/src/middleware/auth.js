const jwt = require('jsonwebtoken');

// ========== VERIFICAR TOKEN ==========
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Token requerido' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // { id, rol, nombre }
        next();
    } catch (err) {
        console.error('Error al verificar token:', err);
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

// ========== VERIFICAR ROL ==========
const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'Usuario no autenticado' });
        }
        
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                mensaje: 'Acceso denegado. Se requiere rol: ' + rolesPermitidos.join(' o ')
            });
        }
        
        next();
    };
};

module.exports = { verificarToken, verificarRol };