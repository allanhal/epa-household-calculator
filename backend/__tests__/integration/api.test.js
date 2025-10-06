// __tests__/integration/api.test.js
import request from "supertest";
import app from "../../src/app.js";

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
