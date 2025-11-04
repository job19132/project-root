import React, { useEffect, useState } from "react";
import axios from "axios";

const DRONE_ID = import.meta.env.VITE_DRONE_ID;
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

function App() {
  const [tab, setTab] = useState("config");
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [celsius, setCelsius] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchConfig();
    fetchLogs();
  }, []);

  async function fetchConfig() {
    try {
      const { data } = await axios.get(`${API_BASE}/configs/${DRONE_ID}`);
      setConfig(data);
      localStorage.setItem("droneConfig", JSON.stringify(data));
    } catch (e) {
      setMsg("Failed to load config");
    }
  }

  async function fetchLogs() {
    try {
      const { data } = await axios.get(`${API_BASE}/logs/${DRONE_ID}?limit=12`);
      setLogs(data);
    } catch (e) {
      setMsg("Failed to load logs");
    }
  }

  async function submitLog(e) {
    e.preventDefault();
    if (!config) return setMsg("Missing config");
    const payload = {
      drone_id: config.drone_id,
      drone_name: config.drone_name,
      country: config.country,
      celsius: Number(celsius),
    };
    try {
      await axios.post(`${API_BASE}/logs`, payload);
      setMsg("Log created");
      setCelsius("");
      fetchLogs();
    } catch (err) {
      setMsg("Failed to create log");
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Drone App</h1>
      <nav>
        <button onClick={() => setTab("config")}>View Config</button>
        <button onClick={() => setTab("form")}>Temperature Form</button>
        <button onClick={() => setTab("logs")}>View Logs</button>
      </nav>

      <div style={{ marginTop: 20 }}>
        {msg && <p style={{ color: "green" }}>{msg}</p>}

        {tab === "config" && (
          <div>
            <h2>Config</h2>
            {config ? (
              <ul>
                <li>Drone ID: {config.drone_id}</li>
                <li>Drone Name: {config.drone_name}</li>
                <li>Light: {config.light}</li>
                <li>Country: {config.country}</li>
                <li>Weight: {config.weight}</li>
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}

        {tab === "form" && (
          <form onSubmit={submitLog}>
            <h2>Add Temperature Log</h2>
            <label>
              Celsius:{" "}
              <input
                type="number"
                value={celsius}
                onChange={(e) => setCelsius(e.target.value)}
                required
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        )}

        {tab === "logs" && (
          <div>
            <h2>Logs (latest 12)</h2>
            <table border="1" cellPadding="6">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Country</th>
                  <th>Drone ID</th>
                  <th>Drone Name</th>
                  <th>Celsius</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="5">No logs</td>
                  </tr>
                )}
                {logs.map((r, i) => (
                  <tr key={i}>
                    <td>{r.created ?? "-"}</td>
                    <td>{r.country ?? "-"}</td>
                    <td>{r.drone_id ?? "-"}</td>
                    <td>{r.drone_name ?? "-"}</td>
                    <td>{r.celsius ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
