import { RegistroMulta } from "../models/RegistroMulta.js";
import { Socio } from "../models/Socio.js";
import { Op, fn, col, where } from "sequelize";

export const buscarMultas = async (search) => {
  if (!search || search.trim() === "") {
    return await RegistroMulta.findAll({
      include: [
        { model: Socio, attributes: ["idSocio", "nombre", "dni", "email"] },
      ],
      order: [["idMulta", "ASC"]],
    });
  }

  const texto = search.toLowerCase();

  return await RegistroMulta.findAll({
    include: [
      { model: Socio, attributes: ["idSocio", "nombre", "dni", "email"], required: false },
    ],
    where: {
      [Op.or]: [
        where(fn("lower", col("Socio.nombre")), { [Op.like]: `%${texto}%` }),
        where(fn("lower", col("Socio.dni")), { [Op.like]: `%${texto}%` }),
        where(fn("lower", col("Socio.email")), { [Op.like]: `%${texto}%` }),
      ],
    },
    raw: true,
    nest: true,
    order: [["idMulta", "ASC"]],
  });
};

export const obtenerMultas = async () => {
  return await RegistroMulta.findAll({
    where: { estado: "ACTIVA" }, // 🔹 corregido aquí
    include: [{ model: Socio, attributes: ["idSocio", "nombre", "numeroSocio"] }],
    order: [["fecha", "DESC"], ["idMulta", "DESC"]],
  });
};

export const crearMulta = async ({ idSocio, motivo, monto, fecha }) => {
  if (!idSocio || !motivo || !monto || !fecha) throw new Error("Datos incompletos");

  if (parseFloat(monto) <= 0) throw new Error("El monto debe ser mayor a 0"); // ✅ validación

  const socio = await Socio.findByPk(idSocio);
  if (!socio) throw new Error("Socio no encontrado"); // ✅ validación

  return await RegistroMulta.create({
    idSocio,
    motivo,
    monto: parseFloat(monto),
    fecha,
    estado: "ACTIVA",
  });
};

export const cancelarMulta = async (idMulta) => {
  const multa = await RegistroMulta.findByPk(idMulta);
  if (!multa) throw new Error("Multa no encontrada");

  multa.estado = "PAGADA"; // 🔹 y aquí
  await multa.save();

  return { msg: "Multa cancelada correctamente" };
};