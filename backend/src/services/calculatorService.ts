import { prisma } from '../config/prisma.js';
import { HouseholdInput } from '../types.js';

export async function saveHousehold(household: HouseholdInput, totalEmissions: number) {
  const toReturn = await prisma.household.create({
    data: {
      ...household,
      totalEmissions,
      energy: { create: household.energy },
      waste: { create: household.waste },
      transportation: { create: household.transportation },
    },
    include: { energy: true, waste: true, transportation: true },
  });
  return toReturn;
}

export async function getAverageEmissions() {
  const result = await prisma.household.aggregate({
    _avg: { totalEmissions: true },
    _count: true,
  });
  return {
    totalEmissionAvg: result._avg.totalEmissions ?? null,
    householdCount: result._count,
  };
}
