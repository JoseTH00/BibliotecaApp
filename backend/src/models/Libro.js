import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Libro = sequelize.define("Libro", {
  idLibro: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: { len: { args: [2, 100], msg: "El título debe tener entre 2 y 100 caracteres" } } // ✅ validación
  },
  autor: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: { len: { args: [2, 100], msg: "El autor debe tener entre 2 y 100 caracteres" } } // ✅ validación
  },
  isbn: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false,
    validate: {
      is: {
        args: /^(97(8|9)[-\s]?)?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?(\d|X)$/,
        msg: "El ISBN debe tener un formato válido (ISBN-10 o ISBN-13, con o sin guiones)",
      },
    },
  },
  estado: { 
    type: DataTypes.ENUM("DISPONIBLE", "PRESTADO"), 
    defaultValue: "DISPONIBLE" 
  },
}, {
  timestamps: false,
});