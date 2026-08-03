# Clinicos Tunisia – Comprehensive Technical Overview

---

## 🌟 Architecture & System Overview
ClinicOS Tunisia is a modern, responsive, role-based medical clinic management system tailored for healthcare practices in Tunisia. Built with **React 18**, **Vite**, and **Tailwind CSS v4**, it operates without any required backend infrastructure by leveraging an offline-first **LocalStorage database engine** with full JSON backup export and import capabilities.

---

## 🔐 3-Tier Security & Authentication System
The system enforces strict role-based access control (RBAC):

1. **Admin (`admin`)**:
   - Authenticated via secure password (`joulaine12!@`).
   - Has **unrestricted global access** to all 9 system views including system metrics, registered user accounts, security lock resets, clinic configurations, and database backups.

2. **Doctor (`doctor`)**:
   - Authenticated via 4-digit PIN (`1234`).
   - Has full access to clinical views: Patients, Calendar, CNAM Prescriptions, Medical Records, Billing, and WhatsApp Reminders.
   - **Restricted**: Settings and database backup tools are strictly blocked.

3. **Secretary (`secretary`)**:
   - Authenticated via 4-digit PIN (`0000`).
   - Has access to reception views: Patient registration, Calendar scheduling, Billing, and WhatsApp Reminders.
   - **Restricted**: Prescriptions, Medical Records, and Settings/Backups are blocked.

---

## 🛠️ Technology Stack
| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 (Hooks, Context API, LocalStorage Data Engine) |
| **Bundler & Tooling** | Vite 6 |
| **Styling & Aesthetics** | Dark Glassmorphic Design System, Tailwind CSS v4, Lucide React Icons |
| **Security & Auth** | `bcryptjs` password hashing & 3-attempt brute-force lock protection |
| **Containerization** | Docker Multi-stage build |
| **CI/CD** | GitHub Actions Workflow (`docker-publish.yml`) |
| **Live Hosting** | Netlify Edge Deployment (`https://elegant-cassata-4239c7.netlify.app/`) |

---

## 🚀 Live Production Deployment
- **Live URL**: **[https://elegant-cassata-4239c7.netlify.app/](https://elegant-cassata-4239c7.netlify.app/)**
- **GitHub Repo**: **[https://github.com/aminzairi/clinicos-tunisia](https://github.com/aminzairi/clinicos-tunisia)**

---

## 📄 License
Licensed under the **MIT License**.
