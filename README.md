# 🩺 ClinicOS Tunisia — Smart Medical Clinic Management Platform

<p align="center">
  <img src="public/favicon.svg" alt="ClinicOS Tunisia Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>A high-performance, role-based medical clinic management software tailored for healthcare professionals in Tunisia. Zero subscription, zero backend setup required.</strong>
</p>

<p align="center">
  <a href="https://elegant-cassata-4239c7.netlify.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/aminzairi/clinicos-tunisia">
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </a>
  <a href="https://hub.docker.com/r/aminzairi/clinicos-tunisia">
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Ready" />
  </a>
  <a href="https://github.com/aminzairi/clinicos-tunisia/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License MIT" />
  </a>
</p>

---

## 🚀 Live Demonstration

👉 **Access Production Web App:** **[https://elegant-cassata-4239c7.netlify.app/](https://elegant-cassata-4239c7.netlify.app/)**

---

## 🔑 Authentication & Access Control Matrix

ClinicOS Tunisia features a strict **3-Tier Separated Login System** with role-based feature scoping:

| Role | Tab / Profile | Default Credential | Access Rights & Privileges |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | **Admin** | Password: `joulaine12!@` | **Full Unrestricted Access** — System Metrics, User Accounts Table, Security Lock Reset, Clinic Config & JSON Database Export/Restore |
| 🩺 **Doctor** | **Espace Médecin** | PIN: `1234` | Full Clinical Suite — Patients, Calendar, CNAM Prescriptions, Medical Records, Billing & Instant WhatsApp Reminders |
| 📋 **Secretary** | **Secrétariat & Accueil** | PIN: `0000` | Reception Suite — Patient Intake, Calendar Scheduling, Billing & WhatsApp Reminders |

> 🔒 **Security Feature**: Settings (*Paramètres du Cabinet & Sauvegarde des Données*) are strictly locked and hidden for Doctor and Secretary roles, ensuring complete data privacy and configuration integrity.

---

## ✨ Feature Highlights

- 💎 **Ultra-Modern Glassmorphic Dark UI**: Designed with ambient radial glow, sleek slate cards, glowing badges, status indicators, and responsive layouts.
- 📄 **Tunisian CNAM Prescription Engine**: Built-in support for CNAM Regime AP1 vs. Ordinary Regime, CNAM IDs, non-substitutable drug flags, and printable prescription templates.
- 📲 **Automated & Direct WhatsApp Web Engine**: One-click direct messaging to patient mobile numbers (`+216`) with localized bilingual templates (French / Arabic).
- 📊 **50-Patient Data Simulation & Auto-Dispatch**: Pre-seeded with 50 realistic Tunisian test patients, appointment records, prescriptions, and invoices.
- 💾 **Offline-First Storage & JSON Database Backup**: Complete local storage engine with single-click export and import of full database backups.
- 🌐 **Bilingual Internationalization (i18n)**: Seamless instant switching between **Français (LTR)** and **العربية (RTL)** with dynamic document direction updating.

---

## 🛠️ Technology Stack

- **Core Framework**: React 18 (Hooks, Context API, useCallback, Custom Storage Engine)
- **Bundler & Build Tool**: Vite 6
- **Styling**: Modern CSS with Tailwind CSS v4 & custom glassmorphic utilities
- **Icons**: Lucide React
- **Cryptography**: `bcryptjs` for secure password hashing and verification
- **Deployment**: Netlify Edge & Multi-stage Docker Containerization

---

## 📂 Architecture & Directory Structure

```text
clinicos-tunisia/
├── public/                  # Favicons, SVGs, and web assets
├── src/
│   ├── components/          # Reusable Glassmorphism UI Components
│   │   ├── Header.jsx       # Top navigation, date chip, role badge & language switcher
│   │   ├── Sidebar.jsx      # Role-filtered vertical navigation bar
│   │   ├── LoginModal.jsx   # 3-Tab separated login portal (PIN & Password)
│   │   ├── PatientModal.jsx # Patient registration & edit modal
│   │   └── ...
│   ├── views/               # Main Application Views
│   │   ├── AdminDashboard.jsx  # System metrics, user accounts & backup tools
│   │   ├── DashboardView.jsx   # Doctor/Secretary overview & stats
│   │   ├── PatientsView.jsx    # Patient list & search (Ctrl+K)
│   │   ├── CalendarView.jsx    # Interactive agenda & appointment management
│   │   ├── SettingsView.jsx    # Locked clinic config & database backup (Admin only)
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication provider & security lockout handler
│   ├── utils/
│   │   ├── storage.js       # LocalStorage wrapper, database seed & JSON backup
│   │   └── translations.js  # Bilingual FR/AR dictionary
│   ├── App.jsx              # Application root & view dispatcher
│   └── index.css            # Dark glassmorphism design system & scrollbars
├── Dockerfile               # Multi-stage production container setup
├── netlify.toml             # Static hosting configuration
└── package.json             # Dependencies & build scripts
```

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/aminzairi/clinicos-tunisia.git
cd clinicos-tunisia

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 📦 Production Build & Docker

### Local Production Build
```bash
npm run build
```
Outputs static bundle to `./dist`.

### Docker Container Run
```bash
# Build Docker image
docker build -t clinicos-tunisia .

# Run Docker container on port 80
docker run -d -p 80:80 --name clinicos-app clinicos-tunisia
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ for healthcare professionals in Tunisia.
</p>
