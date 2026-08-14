# Admin Panel Management System

A full-stack Enterprise Admin Panel built with **Node.js, Express, TypeScript, MongoDB** and **React, Vite, Tailwind CSS, Zustand**.

---

## 🛠️ Installation & Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/admin-panel.git
cd admin-panel
```

---

### 2. Backend Setup

Navigate into the `backend` folder:

```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` folder by copying `.env.example`:

```bash
cp .env.example .env
```

Ensure your `.env` is configured properly (MongoDB URL, JWT secrets, etc.).

#### Run Database Seed Script
Populate system permissions, default roles (`SUPER_ADMIN`, `SUB_ADMIN`), and admin accounts:

```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```

> **Backend Server**: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal window and navigate into the `frontend` folder:

```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the `frontend` folder by copying `.env.example`:

```bash
cp .env.example .env
```

Ensure environment variables point to your backend API:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_BACKEND_URL=http://localhost:5000
```

#### Start Frontend Server
```bash
npm run dev
```

> **Frontend Application**: `http://localhost:5173`

---

## 🔑 Default Login Credentials

After running `npm run seed` in the backend, log in with these default credentials:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@admin.com` | `SuperAdmin@123` | Full System Access (All Permissions) |
| **Sub Admin** | `subadmin@admin.com` | `SubAdmin@123` | Restricted Permissions |
