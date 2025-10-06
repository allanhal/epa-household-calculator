import { EMISSION_FACTORS, WASTE } from '../config/constants.js';
import { HouseholdInput } from '../types.js';

export function calculateTotalEmissions(household: HouseholdInput) {
  let total = 0;

  if (household.energy) {
    total += (household.energy.electricity || 0) * Number(EMISSION_FACTORS.electricity);
    total += (household.energy.naturalGas || 0) * Number(EMISSION_FACTORS.naturalGas);
    total += (household.energy.fuelOil || 0) * Number(EMISSION_FACTORS.fuelOil);
    total += (household.energy.propane || 0) * Number(EMISSION_FACTORS.propane);
  }

  if (household.transportation) {
    household.transportation.forEach((v: { miles?: number; mpg?: number }) => {
      if (v.miles && v.mpg) total += (v.miles / v.mpg) * Number(EMISSION_FACTORS.gasoline);
    });
  }

  if (household.waste) {
    let waste = (household.waste.people || 1) * Number(WASTE.perPerson);
    if (household.waste.recyclesPaper) waste -= Number(WASTE.paper);
    if (household.waste.recyclesPlastic) waste -= Number(WASTE.plastic);
    if (household.waste.recyclesMetal) waste -= Number(WASTE.metal);
    if (household.waste.recyclesGlass) waste -= Number(WASTE.glass);
    total += waste;
  }

  return Math.round(total * 100) / 100;
}
