import express from "express";
import {
  getLibros,
  getLibroById,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  buscarLibros, 
} from "../controllers/libroController.js";

const router = express.Router();

router.get("/", getLibros);
router.get("/buscar", buscarLibros); 
router.get("/:id", getLibroById);
router.post("/", crearLibro);
router.put("/:id", actualizarLibro);
router.delete("/:id", eliminarLibro);

export default router;