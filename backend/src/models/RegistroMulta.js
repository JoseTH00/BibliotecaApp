import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Socio } from "./Socio.js";

export const RegistroMulta = sequelize.define("RegistroMulta", {
  idMulta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  motivo: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: { len: { args: [3, 200], msg: "El motivo debe tener entre 3 y 200 caracteres" } } // ✅ validación
  },
  monto: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
    validate: { min: { args: [0], msg: "El monto no puede ser negativo" } } // ✅ validación
  },
  fecha: { 
    type: DataTypes.DATEONLY, 
    allowNull: false,
    validate: { isDate: { msg: "La fecha debe tener un formato válido" } } // ✅ validación
  },
  estado: { type: DataTypes.ENUM("ACTIVA", "PAGADA"), defaultValue: "ACTIVA" },
  idSocio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Socio, key: "idSocio" },
  },
}, {
  timestamps: false,
});

Socio.hasMany(RegistroMulta, { foreignKey: "idSocio", onDelete: "CASCADE", onUpdate: "CASCADE" });
RegistroMulta.belongsTo(Socio, { foreignKey: "idSocio" });