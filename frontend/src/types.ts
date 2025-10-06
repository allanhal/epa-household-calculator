export type Status = 'idle' | 'sent' | 'loading';

export interface EnergyData {
  electricity: number;
  naturalGas: number;
}

export interface TransportationData {
  miles: number;
  mpg: number;
}

export interface WasteData {
  people: number;
  recyclesPaper: boolean;
  recyclesPlastic: boolean;
  recyclesMetal: boolean;
  recyclesGlass: boolean;
}

export interface HouseholdData {
  energy: EnergyData;
  transportation: TransportationData[];
  waste: WasteData;
}
