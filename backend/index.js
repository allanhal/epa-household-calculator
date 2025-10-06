import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const EMISSION_FACTORS = {
  electricity: process.env.ELECTRICITY_EMISSION_FACTOR || 0.92, // lbs CO₂ per kWh (national average)
  naturalGas: process.env.NATURAL_GAS_EMISSION_FACTOR || 11.7, // lbs CO₂ per therm
  fuelOil: process.env.FUEL_OIL_EMISSION_FACTOR || 22.4, // lbs CO₂ per gallon
  propane: process.env.PROPANE_EMISSION_FACTOR || 12.7, // lbs CO₂ per gallon
  gasoline: process.env.GASOLINE_EMISSION_FACTOR || 19.6, // lbs CO₂ per gallon
  diesel: process.env.DIESEL_EMISSION_FACTOR || 22.4, // lbs CO₂ per gallon
};

const WASTE = {
  perPerson: process.env.PER_PERSON_WASTE || 692, // lbs CO₂ per person per year
  paper: process.env.PAPER_WASTE || 184, // lbs CO₂ saved recycling paper
  plastic: process.env.PLASTIC_WASTE || 25, // lbs CO₂ saved recycling plastic
  metal: process.env.METAL_WASTE || 166, // lbs CO₂ saved recycling metal
  glass: process.env.GLASS_WASTE || 46, // lbs CO₂ saved recycling glass
};

app.get("/", (_, res) => {
  res.redirect("/api");
});

app.get("/api", (req, res) => {
  res.send("EPA Household Carbon Footprint Calculator API");
});

app.post("/api/calculate", async (req, res) => {
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
      let wasteEmissions = (household.waste.people || 1) * WASTE.perPerson;
      if (household.waste.recyclesPaper) wasteEmissions -= WASTE.paper;
      if (household.waste.recyclesPlastic) wasteEmissions -= WASTE.plastic;
      if (household.waste.recyclesMetal) wasteEmissions -= WASTE.metal;
      if (household.waste.recyclesGlass) wasteEmissions -= WASTE.glass;
      totalEmissions += wasteEmissions;
    }

    const newHousehold = await prisma.household.create({
      data: {
        ...household,
        totalEmissions,
        energy: { create: household.energy },
        waste: {
          create: household.waste,
        },
        transportation: {
          create: household.transportation,
        },
      },
      include: { energy: true, waste: true, transportation: true },
    });

    res.json({
      id: newHousehold.id,
      totalEmissions: totalEmissions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/listAverage", async (req, res) => {
  try {
    const result = await prisma.household.aggregate({
      _avg: { totalEmissions: true },
      _count: true,
    });

    res.json({
      totalEmissionAvg: result._avg.totalEmissions,
      householdCount: result._count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Do not start server when doing unit tests
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 8080;
  app.listen(port, () =>
    console.log("EPA Calculator API running on http://localhost:8080")
  );
}

// Export app for testing
export default app;
