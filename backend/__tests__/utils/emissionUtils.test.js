// __tests__/utils/emissionUtils.test.js
import { calculateTotalEmissions } from "../../src/utils/emissionUtils.js";

describe("calculateTotalEmissions", () => {
  it("should calculate emissions for energy", () => {
    const household = {
      energy: { electricity: 100, naturalGas: 10 },
      waste: { people: 1 },
      transportation: [],
    };

    const total = calculateTotalEmissions(household);
    expect(total).toBeGreaterThan(0);
  });

  it("should reduce emissions when recycling", () => {
    const base = calculateTotalEmissions({
      waste: { people: 1, recyclesPaper: false },
    });

    const recycled = calculateTotalEmissions({
      waste: { people: 1, recyclesPaper: true },
    });

    expect(recycled).toBeLessThan(base);
  });

  it("should handle missing data gracefully", () => {
    const total = calculateTotalEmissions({});
    expect(total).toBeGreaterThanOrEqual(0);
  });
});
