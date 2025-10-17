import * as PrestamoService from "../services/prestamoService.js";

export const crearPrestamo = async (req, res) => {
  try {
    const prestamo = await PrestamoService.crearPrestamo(req.body);
    res.status(201).json({ msg: "Préstamo registrado correctamente", prestamo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const devolverLibro = async (req, res) => {
  try {
    const { idPrestamo } = req.params;
    const resultado = await PrestamoService.cerrarPrestamo(idPrestamo);
    res.json({
      msg: "Libro devuelto correctamente",
      diasRetraso: resultado.diasRetraso,
      multa: resultado.multa,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};