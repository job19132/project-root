# Drone Monitoring Project (Assignment #1 + #2)

โปรเจกต์นี้ประกอบด้วย **Backend API Server** (Node.js + Express.js)  
และ **Frontend Web App** (React + Vite)  
สำหรับจัดการและแสดงข้อมูลของ Drone เช่น Config, Status, และ Temperature Logs

---

## 🧩 Features

| Assignment | Feature | Description |
|-------------|----------|-------------|
| 🧱 #1 Backend | `/configs/:droneId` | ดึงข้อมูล Config ของ Drone จาก Google Apps Script |
|  | `/status/:droneId` | ดึงข้อมูลสถานะ (condition) ของ Drone |
|  | `/logs/:droneId` | ดึง Logs ล่าสุดของ Drone จาก PocketBase (จำกัด 12 รายการ) |
|  | `/logs` (POST) | เพิ่ม Temperature Log ใหม่เข้า PocketBase |
| 🌐 #2 Frontend | View Config | แสดงข้อมูล Drone ID / Name / Country / Light |
|  | Temperature Form | ป้อนอุณหภูมิ (celsius) แล้วส่งไปยัง API Server |
|  | View Logs | แสดง Log ล่าสุดของ Drone ในรูปแบบตาราง |

---

## ⚙️ Environment Variables

### 📁 `backend/.env`
env
PORT=3000
DRONE_CONFIG_URL=https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec

LOG_URL=https://app-tracking.pockethost.io/api/collections/drone_logs/records
LOG_API_TOKEN=20250901efx

### 📁 `frontend/.env`
env
VITE_DRONE_ID=3001
VITE_API_BASE=/api

🛠️ Installation & Run
Run Backend (API Server)

cd backend

npm install

npm run dev

Server จะเริ่มที่ http://localhost:3000

ทดสอบได้โดยเรียก:

http://localhost:3000/configs/3001

http://localhost:3000/logs/3001

POST /logs → เพิ่มข้อมูล log ใหม่

Run Frontend (React + Vite)

cd frontend
npm install
npm run dev
เปิด http://localhost:5173

proxy /api จะชี้ไปยัง backend ที่พอร์ต 3000 โดยอัตโนมัติ

Proxy Configuration (frontend/vite.config.js)
js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})