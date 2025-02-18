const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (results.length && await bcrypt.compare(password, results[0].password)) {
      const token = jwt.sign({ id: results[0].id, rol: results[0].rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, rol: results[0].rol });
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  });
};