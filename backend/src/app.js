import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config.js";
import calculatorRoutes from "./routes/calculatorRoutes.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (_, res) => res.redirect("/api"));
app.get("/api", (_, res) =>
  res.send("EPA Household Carbon Footprint Calculator API")
);
app.use("/api", calculatorRoutes);

export default app;
