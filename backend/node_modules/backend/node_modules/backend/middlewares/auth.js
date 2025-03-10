const jwt = require('jsonwebtoken');

const verificarRol = (rolesPermitidos) => (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere un token de autenticación.' });
  }

  try {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!rolesPermitidos.includes(decoded.rol)) {
      return res.status(403).json({ message: 'Permiso insuficiente para realizar esta acción.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado. Por favor, inicia sesión nuevamente.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Token inválido. Verifica tus credenciales.' });
    } else {
      return res.status(500).json({ message: 'Error en la autenticación.' });
    }
  }
};

module.exports = { verificarRol };

