// backend/src/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();   // 👈 ต้องมาก่อนใช้ app.get
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DRONE_CONFIG_URL = process.env.DRONE_CONFIG_URL;
const LOG_URL = process.env.LOG_URL;
const LOG_API_TOKEN = process.env.LOG_API_TOKEN;

// ====================== ROUTES ======================

// GET /configs/:droneId
app.get('/configs/:droneId', async (req, res) => {
  const droneId = Number(req.params.droneId);
  try {
    const resp = await axios.get(DRONE_CONFIG_URL);
    const drones = resp.data.data;

    const drone = drones.find(d => d.drone_id === droneId);
    if (!drone) return res.status(404).json({ error: 'drone not found' });

    const out = {
      drone_id: drone.drone_id,
      drone_name: drone.drone_name,
      light: drone.light,
      country: drone.country,
      weight: drone.weight
    };

    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch config', detail: err.message });
  }
});

// GET /status/:droneId
app.get('/status/:droneId', async (req, res) => {
  const droneId = Number(req.params.droneId);
  try {
    const resp = await axios.get(DRONE_CONFIG_URL);
    const drones = resp.data.data;

    const drone = drones.find(d => d.drone_id === droneId);
    if (!drone) return res.status(404).json({ error: 'drone not found' });

    res.json({ condition: drone.condition });
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch status', detail: err.message });
  }
});

// GET /logs/:droneId
app.get('/logs/:droneId', async (req, res) => {
  const droneId = req.params.droneId;
  const limit = Number(req.query.limit || 12);
  try {
    const resp = await axios.get(LOG_URL, {
      headers: {
        Authorization: `Bearer ${LOG_API_TOKEN}`,
      },
      params: {
        perPage: 200,
        sort: '-created',
      },
    });

    // PocketBase response format
    let items = resp.data.items || resp.data.records || resp.data;
    if (!Array.isArray(items)) items = [];

    // filter by drone_id
    const filtered = items
      .filter(
        (it) =>
          String(it.drone_id ?? it.data?.drone_id ?? '') === String(droneId)
      )
      .map((it) => ({
        drone_id: it.drone_id ?? it.data?.drone_id ?? null,
        drone_name: it.drone_name ?? it.data?.drone_name ?? null,
        country: it.country ?? it.data?.country ?? null,
        celsius: it.celsius ?? it.data?.celsius ?? null,
        created: it.created ?? it.createdAt ?? null,
      }))
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, limit);

    res.json(filtered);
  } catch (err) {
    console.error('GET /logs error:', err.message);
    res.status(500).json({ error: 'failed to fetch logs', detail: err.message });
  }
});

// POST /logs
app.post('/logs', async (req, res) => {
  const { drone_id, drone_name, country, celsius } = req.body;
  if (!drone_id || !drone_name || !country || celsius === undefined) {
    return res
      .status(400)
      .json({ error: 'missing fields', required: 'drone_id, drone_name, country, celsius' });
  }

  try {
    const resp = await axios.post(
      LOG_URL,
      { drone_id, drone_name, country, celsius },
      {
        headers: {
          Authorization: `Bearer ${LOG_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(201).json(resp.data);
  } catch (err) {
    console.error('POST /logs error:', err.message);
    res
      .status(500)
      .json({ error: 'failed to create log', detail: err.response?.data || err.message });
  }
});


// TODO: /logs/:droneId, POST /logs (คุณมีแล้วก็เอามาต่อเพิ่มได้)

// root
app.get('/', (req, res) => res.send({ ok: true }));

// ====================== START SERVER ======================
app.listen(PORT, () => {
  console.log(`Drone API server running on port ${PORT}`);
  console.log("CONFIG URL =", DRONE_CONFIG_URL);
});

module.exports = app;
