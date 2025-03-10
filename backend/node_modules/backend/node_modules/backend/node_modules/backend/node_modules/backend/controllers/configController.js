const Config = require("../models/config");

exports.getAllConfigs = async (req, res) => {
  try {
    const configs = await Config.getAll();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo configuraciones" });
  }
};

exports.getConfigByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const value = await Config.getByKey(key);
    res.json({ key, value });
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo configuración" });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { key, value } = req.body;
    await Config.update(key, value);
    res.json({ message: "Configuración actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando configuración" });
  }
};
