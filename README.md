# 🎯 Job Application Tracker

A production-ready full-stack web application designed to help job seekers organize, track, and analyze their career applications in real-time. 

## 🌐 Live Links
* **Live Demo:** [View Live Application](https://job-tracker-eight-gilt.vercel.app)
* **Backend API Base:** [Render Server Link](https://job-tracker-backend.onrender.com) *(Optional)*

---

## 🚀 Key Features
* **Interactive Dashboard:** Visualizes application statuses (Applied, Interview, Offer, Rejected) using dynamic chart components.
* **Secure Session Management:** Protected client-side routes backed by robust token authentication workflows.
* **Relational Database Integrity:** Normalized data layer with strict foreign key associations to completely prevent orphaned records.

---

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), HTML5, CSS3, JavaScript (ES6+), Recharts, Fetch API
* **Backend:** Node.js, Express.js, RESTful Architecture
* **Database & Auth:** MySQL (`mysql2` connection pooling), JSON Web Tokens (JWT)
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## 💻 Local Setup Instructions

### 1. Database Configuration
Run the primary relational setup scripts using MySQL Workbench:
* Go to **File** → **Open SQL Script** → Navigate to `backend/config/schema.sql` → Click the execute button (⚡).

### 2. Configure Environment Variables
Create a local configuration file inside the server directory:
```bash
cd backend
cp .env.example .env
# Open the .env file and fill in your DB_PASSWORD and JWT_SECRET
