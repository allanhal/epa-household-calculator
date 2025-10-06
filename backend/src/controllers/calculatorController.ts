import { Request, Response } from 'express';

import { getAverageEmissions, saveHousehold } from '../services/calculatorService.js';
import { HouseholdInput } from '../types.js';
import { calculateTotalEmissions } from '../utils/emissionUtils.js';

export async function calculate(req: Request, res: Response) {
  try {
    const { household } = req.body as { household?: HouseholdInput };
    if (!household) return res.status(400).json({ error: 'Missing household data' });
    const total = calculateTotalEmissions(household);
    const newHousehold = await saveHousehold(household, total);

    res.json({ id: newHousehold.id, totalEmissions: total });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(err);
    res.status(500).json({ error: message });
  }
}

export async function listAverage(_req: Request, res: Response) {
  try {
    const result = await getAverageEmissions();
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(err);
    res.status(500).json({ error: message });
  }
}
