import express from "express";
import {
  crearPrestamo,
  devolverLibro,
} from "../controllers/prestamoController.js";

const router = express.Router();

// Registrar préstamo
router.post("/", crearPrestamo);

// Devolver libro y calcular multa (si corresponde)
router.put("/devolver/:idPrestamo", devolverLibro);

export default router;