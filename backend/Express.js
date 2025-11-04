// backend/src/index.js
import express from "express";
import fetch from "node-fetch"; // ถ้าใช้ Node 18+ มี fetch มาให้แล้ว

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/configs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ยิงไปยัง DRONE_CONFIG_URL (Google Apps Script)
    const response = await fetch(`${process.env.DRONE_CONFIG_URL}?id=${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }

    const data = await response.json();

    res.json({
      id,
      config: data,
    });
  } catch (err) {
    console.error("GET /configs error:", err.message);
    res.status(500).json({ error: "failed to fetch config", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
