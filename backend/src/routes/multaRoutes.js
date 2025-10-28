import express from "express";
import {
  getMultas,
  crearMulta,
  cancelarMulta,
  buscarMultas,
} from "../controllers/multaController.js";

const router = express.Router();

router.get("/", getMultas);
router.get("/buscar", buscarMultas); 
router.post("/", crearMulta);
router.put("/:idMulta/cancelar", cancelarMulta);

export default router;