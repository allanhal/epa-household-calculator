import request from "supertest";
import app from "../src/app.js";

describe("EPA Calculator API", () => {
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
