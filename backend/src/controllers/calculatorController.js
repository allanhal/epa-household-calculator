import { calculateTotalEmissions } from "../utils/emissionUtils.js";
import {
  saveHousehold,
  getAverageEmissions,
} from "../services/calculatorService.js";

export async function calculate(req, res) {
  try {
    const { household } = req.body;
    if (!household)
      return res.status(400).json({ error: "Missing household data" });
    const total = calculateTotalEmissions(household);
    const newHousehold = await saveHousehold(household, total);

    res.json({ id: newHousehold.id, totalEmissions: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function listAverage(req, res) {
  try {
    const result = await getAverageEmissions();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
