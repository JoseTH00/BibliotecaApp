import { RegistroMulta } from "../models/RegistroMulta.js";

export const obtenerMultas = async () => {
  return await RegistroMulta.findAll();
};

export const obtenerMultaPorId = async (id) => {
  const multa = await RegistroMulta.findByPk(id);
  if (!multa) throw new Error("Multa no encontrada");
  return multa;
};

export const generarAviso = (multa) => {
  return `Aviso: multa de $${multa.monto} registrada el ${multa.fecha}`;
};

export const calcularMontoRetraso = (dias) => {
  return dias * 100;
};