import express from "express";
import {
  getMultas,
  getMultaById,
} from "../controllers/multaController.js";

const router = express.Router();

router.get("/", getMultas);
router.get("/:id", getMultaById);

export default router;