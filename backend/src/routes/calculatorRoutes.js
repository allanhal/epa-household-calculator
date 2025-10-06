import express from "express";
import { calculate, listAverage } from "../controllers/calculatorController.js";

const router = express.Router();

router.post("/calculate", calculate);
router.get("/listAverage", listAverage);

export default router;
