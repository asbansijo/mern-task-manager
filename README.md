# MERN Task Manager

## Structure
- backend/ - Express + Mongoose API
- frontend/ - React (Vite) frontend

## Quick start

### Backend
1. cd backend
2. copy `.env.example` to `.env` and set `MONGO_URI`
3. npm install
4. npm run dev

### Frontend
1. cd frontend
2. npm install
3. npm run dev

Frontend expects API at http://localhost:5000/api by default. Set VITE_API_BASE in frontend/.env if different.
