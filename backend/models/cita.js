import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Cita = db.define(
  "Cita",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ATENCION: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    FECHA_CITA: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    HORA_CITA: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    SERVICIO: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PROFESIONAL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TIPO_IDE_PACIENTE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    NUMERO_IDE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    NOMBRE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TELEFONO_FIJO: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CREATED_AT: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "citas",
    timestamps: false, // Ya tienes `CREATED_AT`, no necesitas timestamps de Sequelize
  }
);

export default Cita;
