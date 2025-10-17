import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Socio = sequelize.define("Socio", {
  idSocio: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.STRING, unique: true, allowNull: false },
  numeroSocio: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
}, {
  timestamps: false,
});