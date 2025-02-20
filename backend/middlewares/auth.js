const jwt = require('jsonwebtoken');

const verificarRol = (rolesPermitidos) => (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. Token requerido.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET); // Quitar "Bearer " si está presente

    if (!rolesPermitidos.includes(decoded.rol)) {
      return res.status(403).json({ message: 'Permiso insuficiente' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido' });
  }
};

module.exports = { verificarRol };
