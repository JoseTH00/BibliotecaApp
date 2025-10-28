import express from "express";
import {
  getSocios,
  getSocioById,
  crearSocio,
  actualizarSocio,
  eliminarSocio,
} from "../controllers/socioController.js";
import { buscarSocios } from "../controllers/socioController.js";

const router = express.Router();

router.get("/", getSocios);
router.get("/buscar", buscarSocios); 
router.get("/:id", getSocioById);
router.post("/", crearSocio);
router.put("/:id", actualizarSocio);
router.delete("/:id", eliminarSocio);

export default router;