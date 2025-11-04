# 🚀 Drone App Project  
**โดย:** ลาภวัต อินต๊ะแสน (66010719)

## 📘 รายละเอียดโปรเจกต์
โปรเจกต์นี้ประกอบด้วย 2 ส่วนหลัก คือ  
1. **Backend (API Server)** — พัฒนาโดยใช้ **Node.js + Express.js**  
2. **Frontend (Web UI)** — พัฒนาโดยใช้ **React + Vite**

ระบบนี้ออกแบบเพื่อจำลองการทำงานของ **Drone Management System** โดย Backend จะเชื่อมต่อกับ 2 servers ภายนอกคือ  
- **Drone Config Server** (สำหรับอ่านข้อมูล Config ของ Drone)  
- **Drone Log Server** (สำหรับบันทึกและอ่านประวัติ Log อุณหภูมิ)

Frontend ใช้สำหรับแสดงข้อมูล Config, บันทึกค่าอุณหภูมิใหม่ และดูประวัติการทำงานของ Drone

---

## ⚙️ Environment Variables

### Backend (`.env`)
```bash
PORT=3000
DRONE_CONFIG_URL=https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec
LOG_URL=https://app-tracking.pockethost.io/api/collections/drone_logs/records
LOG_API_TOKEN=20250901efx
Frontend (.env)

VITE_DRONE_ID=66010719
VITE_API_BASE=https://rone-backend.onrender.com/api
🖥️ วิธีการรันบนเครื่อง (Local)
🔹 1. Backend
cd backend
npm install
npm run dev
เปิดที่: http://localhost:3000

🔹 2. Frontend
cd frontend
npm install
npm run dev
เปิดที่: http://localhost:5173

🌐 การ Deploy
🔸 Backend (Render)
Host: https://rone-backend.onrender.com

Type: Node.js Web Service

Environment Variables: กรอกค่าจากไฟล์ .env

🔸 Frontend (Vercel)
Host: (URL จาก Vercel ของคุณ)

Framework: React (Vite)

Environment Variables: VITE_DRONE_ID, VITE_API_BASE (URL ของ Backend)

🧭 API ที่มีในระบบ
Method	Path	คำอธิบาย
GET	/configs/:droneId	ดึงข้อมูล Config ของ Drone
GET	/status/:droneId	ดึงสถานะ (condition) ของ Drone
GET	/logs/:droneId	ดึง Log ล่าสุดของ Drone (สูงสุด 12 รายการ)
POST	/logs	เพิ่มข้อมูลอุณหภูมิใหม่ใน Log

🧠 ตัวอย่างผลลัพธ์ API
GET /configs/3001

{
  "drone_id": 3001,
  "drone_name": "Dot Dot So",
  "light": "off",
  "country": "Bharat",
  "weight": 25
}
GET /logs/3001

[
  {
    "drone_id": 3001,
    "drone_name": "Dot Dot So",
    "country": "India",
    "celsius": 45,
    "created": "2024-09-22T07:37:32.111Z"
  }
]
🧑‍💻 ผู้พัฒนา
ชื่อ: ลาภวัต อินต๊ะแสน
รหัสนักศึกษา: 66010719
สาขา: วิศวกรรมระบบไอโอทีและสาระสนเทศ
มหาวิทยาลัย: สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง 

💡 License
This project is created for educational purposes.
© 2025 Lapphawat Intasan.