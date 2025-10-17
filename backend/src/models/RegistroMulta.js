import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Prestamo } from "./Prestamo.js";

export const RegistroMulta = sequelize.define("RegistroMulta", {
  idMulta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idPrestamo: { type: DataTypes.INTEGER, allowNull: false },
  monto: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  descripcion: { type: DataTypes.STRING },
  fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
}, {
  timestamps: false,
});

// Relación con Prestamo
Prestamo.hasMany(RegistroMulta, {
  foreignKey: "idPrestamo",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
RegistroMulta.belongsTo(Prestamo, {
  foreignKey: "idPrestamo"
});