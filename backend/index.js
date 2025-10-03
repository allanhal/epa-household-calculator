import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const EMISSION_FACTORS = {
  electricity: 0.92, // lbs CO₂ per kWh (national average)
  naturalGas: 11.7, // lbs CO₂ per therm
  fuelOil: 22.4, // lbs CO₂ per gallon
  propane: 12.7, // lbs CO₂ per gallon
  gasoline: 19.6, // lbs CO₂ per gallon
  diesel: 22.4, // lbs CO₂ per gallon
};

app.post("/api/calculate", (req, res) => {
  try {
    const { household } = req.body;
    if (!household) {
      return res.status(400).json({ error: "Missing household data" });
    }

    let totalEmissions = 0;

    if (household.energy) {
      totalEmissions +=
        (household.energy.electricity || 0) * EMISSION_FACTORS.electricity;
      totalEmissions +=
        (household.energy.naturalGas || 0) * EMISSION_FACTORS.naturalGas;
      totalEmissions +=
        (household.energy.fuelOil || 0) * EMISSION_FACTORS.fuelOil;
      totalEmissions +=
        (household.energy.propane || 0) * EMISSION_FACTORS.propane;
    }

    if (household.transportation) {
      household.transportation.forEach((vehicle) => {
        if (vehicle.miles && vehicle.mpg) {
          const gallons = vehicle.miles / vehicle.mpg;
          totalEmissions += gallons * EMISSION_FACTORS.gasoline;
        }
      });
    }

    if (household.waste) {
      let wasteEmissions = (household.waste.people || 1) * 692;
      if (household.waste.recyclesPaper) wasteEmissions -= 184;
      if (household.waste.recyclesPlastic) wasteEmissions -= 25;
      if (household.waste.recyclesMetal) wasteEmissions -= 166;
      if (household.waste.recyclesGlass) wasteEmissions -= 46;
      totalEmissions += wasteEmissions;
    }

    res.json({
      totalEmissions: totalEmissions.toFixed(2),
      metricTons: (totalEmissions / 2204.62).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Do not start server when doing unit tests
if (process.env.NODE_ENV !== "test") {
  app.listen(8080, () =>
    console.log("EPA Calculator API running on http://localhost:8080")
  );
}

// Export app for testing
export default app;
