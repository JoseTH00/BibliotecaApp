import { Libro } from "../models/Libro.js";

export const crearLibro = async (data) => {
  const { titulo, autor, isbn } = data;

  if (!titulo || !autor || !isbn) throw new Error("Todos los campos son obligatorios");

  if (!/^(97(8|9)[-\s]?)?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?(\d|X)$/.test(isbn)) {
  throw new Error("ISBN inválido (usa formato ISBN-10 o ISBN-13, con o sin guiones)");
  }

  const existente = await Libro.findOne({ where: { isbn } });
  if (existente) throw new Error("Ya existe un libro con ese ISBN");

  return await Libro.create({ titulo, autor, isbn, estado: "DISPONIBLE" });
};

// Listar todos los libros
export const obtenerLibros = async () => {
  return await Libro.findAll();
};

// Obtener libro por ID
export const obtenerLibroPorId = async (id) => {
  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");
  return libro;
};

// Actualizar libro
export const actualizarLibro = async (id, datos) => {
  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");
  
  if (datos.isbn && !/^(97(8|9)[-\s]?)?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?(\d|X)$/.test(datos.isbn)) {
    throw new Error("ISBN inválido (usa formato ISBN-10 o ISBN-13, con o sin guiones)");
  }
  
  if (datos.isbn) {
    datos.isbn = datos.isbn.replace(/[-\s]/g, "");
  }

  await libro.update(datos);
  return libro;
};

// Eliminar libro
export const eliminarLibro = async (id) => {
  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");
  await libro.destroy();
};

// Prestar libro
export const prestarLibro = async (idLibro) => {
  const libro = await Libro.findByPk(idLibro);
  if (!libro) throw new Error("Libro no encontrado");
  if (libro.estado === "PRESTADO") throw new Error("El libro ya está prestado");

  libro.estado = "PRESTADO";
  await libro.save();
  return libro;
};

// Devolver libro
export const devolverLibro = async (idLibro) => {
  const libro = await Libro.findByPk(idLibro);
  if (!libro) throw new Error("Libro no encontrado");

  libro.estado = "DISPONIBLE";
  await libro.save();
  return libro;
};

// Estado
export const estaDisponible = async (idLibro) => {
  const libro = await Libro.findByPk(idLibro);
  return libro?.estado === "DISPONIBLE";
};