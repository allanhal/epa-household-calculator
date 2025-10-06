export const EMISSION_FACTORS = {
  electricity: process.env.ELECTRICITY_EMISSION_FACTOR || 0.92,
  naturalGas: process.env.NATURAL_GAS_EMISSION_FACTOR || 11.7,
  fuelOil: process.env.FUEL_OIL_EMISSION_FACTOR || 22.4,
  propane: process.env.PROPANE_EMISSION_FACTOR || 12.7,
  gasoline: process.env.GASOLINE_EMISSION_FACTOR || 19.6,
  diesel: process.env.DIESEL_EMISSION_FACTOR || 22.4,
};

export const WASTE = {
  perPerson: process.env.PER_PERSON_WASTE || 692,
  paper: process.env.PAPER_WASTE || 184,
  plastic: process.env.PLASTIC_WASTE || 25,
  metal: process.env.METAL_WASTE || 166,
  glass: process.env.GLASS_WASTE || 46,
};
