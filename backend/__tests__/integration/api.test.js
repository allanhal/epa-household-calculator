// yarn test __tests__/integration/api.test.js
import request from "supertest";
import { jest } from "@jest/globals";

const mockPrisma = {
  household: {
    create: jest.fn(async ({ data }) => ({ id: 1, totalEmissions: data.totalEmissions })),
    aggregate: jest.fn(async () => ({ _avg: { totalEmissions: 0 }, _count: 0 })),
  },
};

await jest.unstable_mockModule("../../src/config/prisma.ts", () => ({
  prisma: mockPrisma,
}));

const { default: app } = await import("../../src/app.ts");

describe("EPA Household API", () => {
  it("should respond to /api", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.text).toContain("EPA Household Carbon Footprint");
  });

  it("should respond to /api/listAverage", async () => {
    const res = await request(app).get("/api/listAverage");
    expect(res.status).toBe(200);
  });

  it("should reject when missing household", async () => {
    const res = await request(app).post("/api/calculate").send({});
    expect(res.status).toBe(400);
  });
});
