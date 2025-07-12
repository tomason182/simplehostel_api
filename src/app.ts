import express from "express";

const app = express();

// Middelware
app.use(express.json());

// Rutas (temporal)
app.get("/", (req, res) => {
  res.send("Simple hostel - Typescript");
});

export default app;
