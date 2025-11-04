// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DRONE_ID = import.meta.env.VITE_DRONE_ID;
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function App() {
  const [tab, setTab] = useState('config');
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [celsius, setCelsius] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchConfig(); fetchLogs(); }, []);

  async function fetchConfig() {
    try {
      const { data } = await axios.get(`${API_BASE}/configs/${DRONE_ID}`);
      setConfig(data);
      // keep in memory for form
      localStorage.setItem('droneConfig', JSON.stringify(data));
    } catch (e) {
      console.error(e);
      setMsg('Failed to load config');
    }
  }

  async function fetchLogs() {
    try {
      const { data } = await axios.get(`${API_BASE}/logs/${DRONE_ID}?limit=12`);
      setLogs(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function submitLog(e) {
    e.preventDefault();
    if (!config) return setMsg('Missing config');
    const payload = {
      drone_id: config.drone_id,
      drone_name: config.drone_name,
      country: config.country,
      celsius: Number(celsius)
    };
    try {
      await axios.post(`${API_BASE}/logs`, payload);
      setMsg('Log created');
      setCelsius('');
      await fetchLogs();
    } catch (err) {
      console.error(err);
      setMsg('Failed to create log');
    }
  }

  return (
    <div style={{ padding: 24, fontFamily:'sans-serif' }}>
      <h1>Drone App</h1>
      <nav style={{ marginBottom: 12 }}>
        <button onClick={() => setTab('config')}>View Config</button>
        <button onClick={() => setTab('form')}>Temperature Form</button>
        <button onClick={() => setTab('logs')}>View Logs</button>
      </nav>

      <div style={{ marginTop: 12 }}>
        {msg && <div style={{ color: 'green' }}>{msg}</div>}

        {tab === 'config' && (
          <div>
            <h2>Config</h2>
            {config ? (
              <ul>
                <li><strong>Drone ID:</strong> {config.drone_id}</li>
                <li><strong>Drone Name:</strong> {config.drone_name}</li>
                <li><strong>Light:</strong> {config.light}</li>
                <li><strong>Country:</strong> {config.country}</li>
              </ul>
            ) : <div>Loading...</div>}
          </div>
        )}

        {tab === 'form' && (
          <div>
            <h2>Temperature Log Form</h2>
            <form onSubmit={submitLog}>
              <div>
                <label>Temperature (°C): </label>
                <input value={celsius} onChange={e=>setCelsius(e.target.value)} type="number" required />
              </div>
              <div style={{ marginTop: 8 }}>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        )}

        {tab === 'logs' && (
          <div>
            <h2>Logs (latest 12)</h2>
            <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Created</th><th>Country</th><th>Drone ID</th><th>Drone Name</th><th>Celsius</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && <tr><td colSpan="5">No logs</td></tr>}
                {logs.map((r, i) => (
                  <tr key={i}>
                    <td>{r.created ?? '-'}</td>
                    <td>{r.country ?? '-'}</td>
                    <td>{r.drone_id ?? '-'}</td>
                    <td>{r.drone_name ?? '-'}</td>
                    <td>{r.celsius ?? '-'}</td>
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
