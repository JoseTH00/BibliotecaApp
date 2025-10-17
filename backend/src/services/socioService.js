import { Socio } from "../models/Socio.js";

// Crear socio
export const registrarSocio = async (datos) => {
  const { dni, numeroSocio, nombre, email, telefono } = datos;
  if (!dni || !numeroSocio || !nombre) throw new Error("Datos incompletos");

  const existe = await Socio.findOne({ where: { dni } });
  if (existe) throw new Error("El socio ya está registrado");

  const socio = await Socio.create({ dni, numeroSocio, nombre, email, telefono });
  return socio;
};

// Listar socios
export const obtenerSocios = async () => {
  return await Socio.findAll();
};

// Obtener socio por ID
export const obtenerSocioPorId = async (id) => {
  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");
  return socio;
};

// Actualizar socio
export const actualizarSocio = async (id, datos) => {
  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");
  await socio.update(datos);
  return socio;
};

// Eliminar socio
export const eliminarSocio = async (id) => {
  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");
  await socio.destroy();
};