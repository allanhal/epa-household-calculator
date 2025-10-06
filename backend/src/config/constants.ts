export const EMISSION_FACTORS = {
  electricity: Number(process.env.ELECTRICITY_EMISSION_FACTOR) || 0.92,
  naturalGas: Number(process.env.NATURAL_GAS_EMISSION_FACTOR) || 11.7,
  fuelOil: Number(process.env.FUEL_OIL_EMISSION_FACTOR) || 22.4,
  propane: Number(process.env.PROPANE_EMISSION_FACTOR) || 12.7,
  gasoline: Number(process.env.GASOLINE_EMISSION_FACTOR) || 19.6,
  diesel: Number(process.env.DIESEL_EMISSION_FACTOR) || 22.4,
};

export const WASTE = {
  perPerson: Number(process.env.PER_PERSON_WASTE) || 692,
  paper: Number(process.env.PAPER_WASTE) || 184,
  plastic: Number(process.env.PLASTIC_WASTE) || 25,
  metal: Number(process.env.METAL_WASTE) || 166,
  glass: Number(process.env.GLASS_WASTE) || 46,
};
