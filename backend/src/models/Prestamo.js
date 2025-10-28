import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Socio } from "./Socio.js";
import { Libro } from "./Libro.js";

export const Prestamo = sequelize.define("Prestamo", {
  idPrestamo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // ✅ Fecha de inicio del préstamo
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: "La fecha de inicio debe tener un formato válido" },
      // ✅ No permitir fechas anteriores al día actual
      isNotBeforeToday(value) {
        const hoy = new Date().toISOString().split("T")[0];
        if (value < hoy) {
          throw new Error("La fecha de inicio no puede ser anterior a hoy");
        }
      },
    },
  },

  // ✅ Fecha de devolución esperada
  fechaDevolucion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: "La fecha de devolución debe tener un formato válido" },
      // ✅ Debe ser igual o posterior a la fecha de inicio
      isAfterOrEqualStart(value) {
        if (this.fechaInicio && value < this.fechaInicio) {
          throw new Error("La fecha de devolución no puede ser anterior a la fecha de inicio");
        }
      },
    },
  },

  fechaRealDevolucion: {
    type: DataTypes.DATEONLY,
  },

  multa: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: "La multa no puede ser negativa" },
    },
  },

  estadoPrestamo: {
    type: DataTypes.ENUM("ACTIVO", "CERRADO"),
    defaultValue: "ACTIVO",
  },
}, {
  timestamps: false,
});

// 🔗 Relaciones
Socio.hasMany(Prestamo, {
  foreignKey: "idSocio",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Prestamo.belongsTo(Socio, { foreignKey: "idSocio" });

Libro.hasMany(Prestamo, {
  foreignKey: "idLibro",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Prestamo.belongsTo(Libro, { foreignKey: "idLibro" });