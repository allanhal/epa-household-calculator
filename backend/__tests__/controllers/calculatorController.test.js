// __tests__/controllers/calculatorController.test.js

import { jest } from "@jest/globals";

const mockPrisma = {
  household: {
    create: jest.fn(),
    aggregate: jest.fn(),
  },
};

// Needing this because prisma client uses getters that Jest can't handle well
await jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: mockPrisma,
}));

const mockEmissionUtils = {
  calculateTotalEmissions: jest.fn(),
};

const mockCalculatorService = {
  getAverageEmissions: jest.fn(),
  saveHousehold: jest.fn(async (householdData, totalEmissions) =>
    mockPrisma.household.create({
      data: {
        totalEmissions,
        energy: { create: householdData.energy },
        waste: { create: householdData.waste },
        transportation: { create: householdData.transportation },
      },
    })
  ),
};

// To be able to mock those to use for services and utils
let calculate, listAverage;

beforeAll(async () => {
  await jest.unstable_mockModule("../../src/utils/emissionUtils.js", () => ({
    calculateTotalEmissions: mockEmissionUtils.calculateTotalEmissions,
  }));

  await jest.unstable_mockModule(
    "../../src/services/calculatorService.js",
    () => ({
      getAverageEmissions: mockCalculatorService.getAverageEmissions,
      saveHousehold: mockCalculatorService.saveHousehold,
    })
  );

  // Importing to mock those dependencies
  ({ calculate, listAverage } = await import(
    "../../src/controllers/calculatorController.js"
  ));
});

describe("calculatorController", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  it("should return 400 if missing household", async () => {
    req.body = {};
    await calculate(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Not ideal, but to ensure prisma client is being called
  it("should call prisma.household.create", async () => {
    req.body = {
      household: {
        energy: { electricity: 100 },
        waste: { people: 1 },
        transportation: [],
      },
    };

    mockEmissionUtils.calculateTotalEmissions.mockReturnValue(1);

    mockPrisma.household.create.mockResolvedValue({
      id: 34,
      energyId: 34,
      wasteId: 34,
      totalEmissions: 1,
      lastCalculated: "2025-10-06T18:14:47.059Z",
      energy: { id: 34, electricity: 100, naturalGas: 0, householdId: null },
      waste: {
        id: 34,
        people: 1,
        recyclesPaper: false,
        recyclesPlastic: false,
        recyclesMetal: false,
        recyclesGlass: false,
        householdId: null,
      },
      transportation: [],
    });

    await calculate(req, res);

    expect(mockPrisma.household.create).toHaveBeenCalled();
  });

  it("should calculate and save household", async () => {
    req.body = {
      household: {
        energy: { electricity: 100 },
        waste: { people: 1 },
        transportation: [],
      },
    };

    mockEmissionUtils.calculateTotalEmissions.mockReturnValue(123);
    mockCalculatorService.saveHousehold.mockResolvedValue({
      id: 28,
      energyId: 28,
      wasteId: 28,
      totalEmissions: 784,
      lastCalculated: "2025-10-06T17:40:20.858Z",
      energy: { id: 28, electricity: 100, naturalGas: 0, householdId: null },
      waste: {
        id: 28,
        people: 1,
        recyclesPaper: false,
        recyclesPlastic: false,
        recyclesMetal: false,
        recyclesGlass: false,
        householdId: null,
      },
      transportation: [],
    });

    await calculate(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 28, totalEmissions: 123 });
  });

  it("should return average emissions", async () => {
    mockCalculatorService.getAverageEmissions.mockResolvedValue({
      householdCount: 20,
      totalEmissionAvg: 10629.63,
    });

    await listAverage(req, res);
    expect(res.json).toHaveBeenCalledWith({
      totalEmissionAvg: 10629.63,
      householdCount: 20,
    });
  });
});
