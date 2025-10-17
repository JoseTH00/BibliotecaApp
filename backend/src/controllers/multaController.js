import * as MultaService from "../services/multaService.js";

export const getMultas = async (req, res) => {
  try {
    const multas = await MultaService.obtenerMultas();
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMultaById = async (req, res) => {
  try {
    const { id } = req.params;
    const multa = await MultaService.obtenerMultaPorId(id);
    res.json(multa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};