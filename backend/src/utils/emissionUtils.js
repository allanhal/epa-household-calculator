import { EMISSION_FACTORS, WASTE } from "../config/constants.js";

export function calculateTotalEmissions(household) {
  let total = 0;

  if (household.energy) {
    total += (household.energy.electricity || 0) * EMISSION_FACTORS.electricity;
    total += (household.energy.naturalGas || 0) * EMISSION_FACTORS.naturalGas;
    total += (household.energy.fuelOil || 0) * EMISSION_FACTORS.fuelOil;
    total += (household.energy.propane || 0) * EMISSION_FACTORS.propane;
  }

  if (household.transportation) {
    household.transportation.forEach((v) => {
      if (v.miles && v.mpg)
        total += (v.miles / v.mpg) * EMISSION_FACTORS.gasoline;
    });
  }

  if (household.waste) {
    let waste = (household.waste.people || 1) * WASTE.perPerson;
    if (household.waste.recyclesPaper) waste -= WASTE.paper;
    if (household.waste.recyclesPlastic) waste -= WASTE.plastic;
    if (household.waste.recyclesMetal) waste -= WASTE.metal;
    if (household.waste.recyclesGlass) waste -= WASTE.glass;
    total += waste;
  }

  return total;
}
