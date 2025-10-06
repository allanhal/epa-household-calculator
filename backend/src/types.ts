export type EnergyInput = {
  electricity?: number;
  naturalGas?: number;
  fuelOil?: number;
  propane?: number;
};

export type TransportationInput = {
  miles?: number;
  mpg?: number;
}[];

export type WasteInput = {
  people?: number;
  recyclesPaper?: boolean;
  recyclesPlastic?: boolean;
  recyclesMetal?: boolean;
  recyclesGlass?: boolean;
};

export type HouseholdInput = {
  energy?: EnergyInput;
  transportation?: TransportationInput;
  waste?: WasteInput;
};
