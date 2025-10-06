// yarn test __tests__/e2e.test.js
import request from "supertest";
import { jest } from "@jest/globals";

// If we want to mock the prisma client, in case the database is not available
// const mockPrisma = {
//   household: {
//     create: jest.fn(async ({ data }) => ({ id: 1, totalEmissions: data.totalEmissions })),
//     aggregate: jest.fn(async () => ({ _avg: { totalEmissions: 0 }, _count: 0 })),
//   },
// };

// await jest.unstable_mockModule("../src/config/prisma.ts", () => ({
//   prisma: mockPrisma,
// }));

const { default: app } = await import("../src/app.ts");

describe("e2e tests for EPA Calculator API", () => {
  it("should calculate emissions for sample household", async () => {
    const response = await request(app)
      .post("/api/calculate")
      .send({
        household: {
          energy: { electricity: 900, naturalGas: 50 },
          transportation: [{ miles: 12000, mpg: 25 }],
          waste: {
            people: 3,
            recyclesPaper: true,
            recyclesPlastic: true,
            recyclesMetal: false,
            recyclesGlass: true,
          },
        },
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("totalEmissions");

    expect(response.body.totalEmissions).toBe(12642);
  });
  it("should list average", async () => {
    const response = await request(app).get("/api/listAverage").send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("householdCount");
    expect(response.body).toHaveProperty("totalEmissionAvg");

    expect(response.body.householdCount).toBeGreaterThanOrEqual(0);
    expect(response.body.totalEmissionAvg).toBeGreaterThanOrEqual(0);
  });
});
