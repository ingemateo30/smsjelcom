const jwt = require('jsonwebtoken');
const verificarRol = (rolesPermitidos) => (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).send('Acceso denegado');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!rolesPermitidos.includes(decoded.rol)) {
      return res.status(403).send('Permiso insuficiente');
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Token inválido');
  }
};
module.exports = { verificarRol };