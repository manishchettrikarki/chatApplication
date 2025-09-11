import express from "express";
import { appRouter } from "./router";
import bodyParser from "body-parser";
import cors from "cors";

//
export const app = express();
app.use(cors());

//
app.use(bodyParser.json());

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", appRouter);
