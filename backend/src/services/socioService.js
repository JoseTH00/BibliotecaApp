import { Socio } from "../models/Socio.js";

// Crear socio (sin pedir número de socio manualmente)
export const registrarSocio = async (datos) => {
  const { dni, nombre, email, telefono } = datos;

  if (!dni || !nombre || !email) throw new Error("Nombre, DNI y correo son obligatorios");

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("El formato del correo es inválido"); // ✅ validación
  }

  if (telefono && !/^[0-9]{7,15}$/.test(telefono)) {
    throw new Error("Solo numeros: El teléfono debe tener entre 7 y 15 números"); // ✅ validación
  }

  const existe = await Socio.findOne({ where: { dni } });
  if (existe) throw new Error("El socio ya está registrado");

  const socio = await Socio.create({ dni, nombre, email, telefono });
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

  const { email, telefono } = datos;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("El formato del correo es inválido");
  }

  if (telefono && !/^[0-9]{7,15}$/.test(telefono)) {
    throw new Error("Solo numeros: El teléfono debe tener entre 7 y 15 números");
  }

  await socio.update(datos);
  return socio;
};

// Eliminar socio
export const eliminarSocio = async (id) => {
  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");
  await socio.destroy();
};