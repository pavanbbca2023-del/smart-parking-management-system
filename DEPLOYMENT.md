# Deployment Guide: Smart Parking Management System

This document provides instructions on how to deploy the Smart Parking Management System to a production environment.

## 1. Backend (Django) Deployment

### Prerequisites
- Python 3.10+
- A production database (PostgreSQL recommended, SQLite is default)
- A domain name for your API

### Setup
1. **Environment Variables**: 
   - Copy `backend/.env.example` to `backend/.env`.
   - Update the values with your production secrets (Razorpay, Twilio, Secret Key).
   - Set `DEBUG=False` and your production domain in `ALLOWED_HOSTS`.

2. **Database Migrations**:
   ```bash
   python manage.py migrate
   ```

3. **Static Files**:
   ```bash
   python manage.py collectstatic
   ```

4. **Production Server**:
   Use a WSGI server like Gunicorn:
   ```bash
   gunicorn smart_parking.wsgi:application
   ```

## 2. Frontend (React) Deployment

### Build Process
You will need to create **3 separate projects** on Vercel (one for Admin, Staff, and User):

1. **Import Repository**: In Vercel, click "New Project" and select your repository.
2. **Configure Settings**:
   - **Project Name**: e.g., `parking-admin`, `parking-staff`, `parking-user`.
   - **Root Directory**: Click "Edit" and select the specific folder (e.g., `frontend/admin`).
   - **Build Command**: `npm run build` (This is auto-detected).
   - **Output Directory**: `dist` (This is auto-detected).
3. **Environment Variables**:
   - Add `VITE_API_BASE_URL` and set it to your backend URL (e.g., `https://smart-parking.onrender.com`).
4. **Deploy**: Click "Deploy". 

> [!TIP]
> I have already created `vercel.json` files in each folder. These will handle the React Router "404 on refresh" issue automatically.

## 3. Platform Specific Tips (Vercel + Render)

If you are using **Vercel** for the Frontend and **Render** for the Backend:

### On Render (Backend)
- **Database**: Do **NOT** use `db.sqlite3` on Render's free tier (data will be deleted every time the server restarts). 
  - *Recommendation*: Use Render's **Managed PostgreSQL** (Free tier available) or an external DB like **Supabase** or **Neon**.
- **Allowed Hosts**: Add your Vercel URL to `ALLOWED_HOSTS` in your Render environment variables.
- **CORS**: Add your Vercel URL to `CORS_ALLOWED_ORIGINS` in `settings.py`.

### On Vercel (Frontend)
- **Environment Variables**: In the Vercel Project Settings, add `VITE_API_BASE_URL` and set it to your Render service URL (e.g., `https://smart-parking-api.onrender.com`).
- **Framework Preset**: Choose `Vite` during the Vercel import process.

## 4. Important Production Checklist
- [ ] Change `SECRET_KEY` in `.env`.
- [ ] Set `DEBUG=False`.
- [ ] Use **PostgreSQL** instead of SQLite for data persistence.
- [ ] Ensure HTTPS is enabled (Render/Vercel handles this automatically).
