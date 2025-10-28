import express from "express";
import {
  obtenerPrestamos,
  crearPrestamo,
  devolverLibro,
  buscarPrestamos, 
} from "../controllers/prestamoController.js";

const router = express.Router();

router.get("/", obtenerPrestamos);
router.get("/buscar", buscarPrestamos); 
router.post("/", crearPrestamo);
router.put("/:idPrestamo/devolver", devolverLibro);

export default router;