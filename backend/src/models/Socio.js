import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Socio = sequelize.define("Socio", {
  idSocio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" }, // ✅ validación
    }
  },
  dni: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      is: {
        args: /^[0-9]{7,10}$/,
        msg: "El DNI debe contener solo números (7 a 10 dígitos)", // ✅ validación
      },
    },
  },
  numeroSocio: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // ✅ obligatorio
    validate: {
      isEmail: { msg: "El correo electrónico no tiene un formato válido" }, // ✅ validación
    },
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: /^[0-9]{7,15}$/,
        msg: "El teléfono debe contener solo números (7 a 15 dígitos)", // ✅ validación
      },
    },
  }
}, {
  timestamps: false,
});

Socio.beforeCreate(async (socio) => {
  const ultimoSocio = await Socio.max("numeroSocio");
  const nuevoNumero = ultimoSocio ? parseInt(ultimoSocio) + 1 : 1;
  socio.numeroSocio = nuevoNumero.toString().padStart(4, "0");
});