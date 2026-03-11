# HRMS Lite — Human Resource Management System

A clean, full-stack HRMS web application for managing employee records and tracking daily attendance.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| Frontend | `https://your-app.vercel.app` |
| Backend API | `https://your-api.onrender.com` |
| API Docs | `https://your-api.onrender.com/docs` |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Python 3.11, FastAPI, SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Styling | Custom CSS (no UI library) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py          # FastAPI app + routes
│   ├── models.py        # SQLAlchemy ORM models
│   ├── schemas.py       # Pydantic validation schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # DB connection setup
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Employees.js
│   │   │   └── Attendance.js
│   │   ├── services/
│   │   │   └── api.js   # Axios API calls
│   │   ├── App.js       # Layout + routing
│   │   ├── index.js
│   │   └── index.css    # All styles
│   └── package.json
│
└── README.md
```

---

## ⚙️ Run Locally — Step by Step

### Prerequisites
- **Python 3.9+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/hrms-lite.git
cd hrms-lite
```

---

### Step 2 — Setup Backend

```bash
# Navigate to backend
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Copy env file
cp .env.example .env

# Start the backend server
uvicorn main:app --reload --port 8000
```

✅ Backend is now running at: **http://localhost:8000**  
📖 API Docs available at: **http://localhost:8000/docs**

---

### Step 3 — Setup Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend
cd frontend

# Copy env file and configure API URL
cp .env.example .env
# The default .env points to http://localhost:8000 — no changes needed for local dev

# Install dependencies
npm install

# Start the frontend dev server
npm start
```

✅ Frontend is now running at: **http://localhost:3000**

---

## 🌐 Deploy to Production

### Backend → Render (Free Tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo, set root directory to `backend`
4. Set the following:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable:
   - `DATABASE_URL` = your PostgreSQL connection string *(optional — SQLite works on Render too)*
6. Deploy and copy the URL

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set root directory to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com`
4. Deploy

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/employees` | Add new employee |
| `GET` | `/employees` | List all employees |
| `GET` | `/employees/{id}` | Get single employee |
| `DELETE` | `/employees/{id}` | Delete employee |
| `POST` | `/attendance` | Mark attendance |
| `GET` | `/attendance/{id}` | Get employee attendance |
| `GET` | `/dashboard/summary` | Dashboard stats |

---

## ✅ Features

### Core
- ➕ Add employees (Employee ID, Name, Email, Department)
- 📋 View all employees with search
- 🗑 Delete employees (cascades attendance records)
- ✅ Mark attendance (Present / Absent) per employee per day
- 🔄 Re-marking same date updates the record
- 📊 View attendance records per employee

### Bonus
- 📅 Filter attendance by date range
- 🔢 Present/Absent day count per employee
- 📈 Dashboard with live summary stats

---

## ⚠️ Assumptions & Limitations

- Single admin user — no authentication required (as per spec)
- SQLite is used for local development; PostgreSQL recommended for production
- Attendance is one record per employee per day (re-marking updates the existing record)
- Leave management, payroll, and other advanced HR features are out of scope

---

## 🤝 License

MIT
