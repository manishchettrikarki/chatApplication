import cors from "cors";
import express from "express";
import { appRouter } from "./router";

//
export const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", appRouter);
