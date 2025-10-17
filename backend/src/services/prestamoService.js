import { Prestamo } from "../models/Prestamo.js";
import { Libro } from "../models/Libro.js";
import { RegistroMulta } from "../models/RegistroMulta.js";

export const crearPrestamo = async ({ idLibro, idSocio, fechaInicio, fechaDevolucion }) => {
  const libro = await Libro.findByPk(idLibro);
  if (!libro) throw new Error("Libro no encontrado");
  if (libro.estado === "PRESTADO") throw new Error("El libro no está disponible");

  const prestamo = await Prestamo.create({
    idLibro,
    idSocio,
    fechaInicio,
    fechaDevolucion,
  });

  libro.estado = "PRESTADO";
  await libro.save();

  return prestamo;
};

export const cerrarPrestamo = async (idPrestamo) => {
  const prestamo = await Prestamo.findByPk(idPrestamo, { include: Libro });
  if (!prestamo) throw new Error("Préstamo no encontrado");

  prestamo.estadoPrestamo = "CERRADO";
  prestamo.fechaRealDevolucion = new Date();

  const fechaDev = new Date(prestamo.fechaDevolucion);
  const fechaReal = new Date(prestamo.fechaRealDevolucion);
  const diasRetraso = Math.max(0, (fechaReal - fechaDev) / (1000 * 60 * 60 * 24));

  let multa = null;
  if (diasRetraso > 0) {
    const monto = diasRetraso * 100;
    multa = await RegistroMulta.create({
      idPrestamo,
      monto,
      descripcion: `Retraso de ${diasRetraso} día(s)`,
    });
    prestamo.multa = monto;
  }

  await prestamo.save();

  const libro = prestamo.Libro;
  libro.estado = "DISPONIBLE";
  await libro.save();

  return { prestamo, multa, diasRetraso };
};