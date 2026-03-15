# 🏛️ Civic Portal — Frontend

A React.js web application that connects citizens with municipal authorities. Citizens can report civic issues, track complaint status, and view issues on a live map.

---

## 🌐 Live URLs

| Service | URL |
|---|---|
| **Frontend (Live)** | https://civic-portal-frontend.onrender.com |
| **Backend API** | https://civic-portal-backend-ey7f.onrender.com/api |

---

## 🧰 Tech Stack

- **React.js** — UI framework
- **Vite** — Build tool
- **Bootstrap 5** — Styling
- **Axios** — API calls
- **React Router DOM** — Navigation
- **Leaflet.js + React Leaflet** — Interactive maps
- **OpenStreetMap Nominatim** — Reverse geocoding (address from coordinates)

---

## ✅ Prerequisites

Before you start make sure you have these installed:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18 or higher | https://nodejs.org |
| Git | Any | https://git-scm.com |
| VS Code | Any | https://code.visualstudio.com |

> ⚠️ You do **NOT** need PHP, Laravel, MySQL, or XAMPP. The backend is already deployed.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/civic-portal-frontend.git
cd civic-portal-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

App runs at **http://localhost:5173**

---

## 📁 Project Structure

```
civic-portal-frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx               ← Landing page
│   │   ├── Login.jsx              ← Login form
│   │   ├── Register.jsx           ← Register form
│   │   ├── ReportComplaint.jsx    ← Submit complaint + map
│   │   ├── TrackComplaint.jsx     ← Citizen complaint list
│   │   ├── AdminDashboard.jsx     ← Admin management panel
│   │   └── AdminMap.jsx           ← Map view of all complaints
│   ├── components/
│   │   ├── Navbar.jsx             ← Navigation bar
│   │   ├── MapPicker.jsx          ← Leaflet map for location picking
│   │   └── StatusBadge.jsx        ← Colored status tag
│   ├── services/
│   │   └── api.js                 ← Axios API configuration
│   ├── assets/
│   │   ├── location.svg
│   │   ├── tracking.svg
│   │   └── community.svg
│   ├── pages/
│   │   └── LandingPage.css        ← Landing page styles
│   ├── App.jsx                    ← All routes defined here
│   └── main.jsx                   ← Entry point
└── index.html
```

---

## 🔗 API Connection

All API calls go through `src/services/api.js`. It automatically attaches the Bearer token to every request.

```js
// src/services/api.js
const api = axios.create({
  baseURL: 'https://civic-portal-backend-ey7f.onrender.com/api'
});
```

**You never need to change this file unless the backend URL changes.**

---

## 👤 Test Accounts

Use these accounts to test different roles:

| Role | Email | Password |
|---|---|---|
| Admin | admin@civicportal.com | password123 |
| Citizen | citizen@civicportal.com | password123 |
| Worker | worker@civicportal.com | password123 |

---

## 🗺️ Pages & Routes

| Route | Page | Who Can Access |
|---|---|---|
| `/` | Home — Landing page | Everyone |
| `/login` | Login | Everyone |
| `/register` | Register | Everyone |
| `/report` | Report a complaint | Logged in citizens |
| `/track` | Track own complaints | Logged in citizens |
| `/admin` | Admin dashboard | Admin only |
| `/admin/map` | Map view of complaints | Admin only |

---

## 🤝 How to Contribute

### Step 1 — Pull Latest Code Every Morning

```bash
git pull origin main
```

### Step 2 — Create Your Own Branch

Always work on a separate branch — never directly on `main`:

```bash
git checkout -b feature/your-feature-name
```

**Branch naming examples:**
```bash
git checkout -b feature/login-page
git checkout -b feature/admin-dashboard
git checkout -b feature/map-integration
git checkout -b fix/register-bug
```

### Step 3 — Make Your Changes

Write your code in VS Code. Test on `http://localhost:5173`.

### Step 4 — Save Your Progress

```bash
git add .
git commit -m "Short description of what you did"
```

**Good commit message examples:**
```
"Add login form validation"
"Fix status badge color for in_progress"
"Update navbar to show user name"
```

### Step 5 — Push Your Branch

```bash
git push origin feature/your-feature-name
```

### Step 6 — Create Pull Request

1. Go to GitHub repo
2. Click **Compare & pull request**
3. Add a short description
4. Click **Create pull request**
5. Tell the team to review it

---

## 📋 Task Split

| Person | Pages / Components |
|---|---|
| Person 1 | `ReportComplaint.jsx`, `TrackComplaint.jsx`, `MapPicker.jsx` |
| Person 2 | `Login.jsx`, `Register.jsx`, `Navbar.jsx` |
| Person 3 | `AdminDashboard.jsx`, `AdminMap.jsx`, `StatusBadge.jsx` |

---

## 🐛 Common Issues & Fixes

| Problem | Fix |
|---|---|
| `npm install` fails | Make sure Node.js 18+ is installed |
| Blank white page | Check browser console F12 for errors |
| API returns 401 | Token missing — try logging out and back in |
| Map not showing | Make sure `import 'leaflet/dist/leaflet.css'` is in `main.jsx` |
| Map marker missing | Add `L.Icon.Default.mergeOptions` fix in `MapPicker.jsx` |
| CORS error | Tell the backend developer to add your URL to `cors.php` |
| `/register` shows 404 on live site | Render rewrite rule needs to be set — tell team lead |

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server at localhost:5173
npm run build    # Build for production (creates dist/ folder)
npm run preview  # Preview production build locally
```

---

## 🚢 Deployment

The frontend is deployed on **Render** as a Static Site.

Every time you push to `main` branch Render automatically redeploys.

```bash
git push origin main  # triggers auto-deploy on Render
```

---

## 📞 Need Help?

- Check the **API & Frontend Guide** document for full API reference
- Check the **Complete Project Documentation** for full project details
- Ask the team lead if you're stuck

---

*Built with ❤️ using React + Laravel*
