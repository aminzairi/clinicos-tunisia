# Clinicos Tunisia – Smart Clinic Management

[![CI](https://github.com/aminzairi/clinicos-tunisia/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/aminzairi/clinicos-tunisia/actions/workflows/docker-publish.yml)  
[![Docker Pulls](https://camo.githubusercontent.com/a3c715c22be6230413555c7546ae8c5c2ecfc3636805f3d9b368eace0b4d3dc7/68747470733a2f2f696d672e736869656c64732e696f2f646f636b65722f70756c6c732f616d696e7a616972692f636c696e69636f732d74756e697369613f6c6f676f3d646f636b6572)](https://hub.docker.com/r/aminzairi/clinicos-tunisia)

**A sleek, role‑based medical clinic management web app built with React + Vite, ready for Docker or static‑site deployment.**

---

## 🎬 Live Demo

🚀 **Try it now:** https://elegant-cassata-4239c7.netlify.app/

![App Dashboard](file:///C:/Users/Zairi/.gemini/antigravity/brain/5ebbc7e4-f6fc-4a92-824c-913f04421fe2/app_screenshot_1785721759941.jpg)

---

## ✨ Why# ClinicOS Tunisia

_Automated build on $(date)_

---
 **Role‑Based UI** – Doctor sees full patient/appointment suite; Secretary gets a focused workflow.
- **Zero‑backend, instant setup** – All data stored locally in `localStorage` (perfect for demos, training, or small clinics).
- **Security‑first** – Built‑in lock‑out after 3 failed logins, protecting against credential stuffing.
- **Docker‑ready** – Multi‑stage Dockerfile and GitHub Actions CI push an image to GHCR for easy server deployment.
- **Netlify‑friendly** – Static build can be deployed in seconds to any Netlify account.
- **Beautiful UI** – Dark‑mode, glass‑morphism, smooth micro‑animations, and Google‑Font typography for a premium look.

---

## 🛠️ Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | **React 18**, **Vite**, vanilla CSS (dark‑mode, glassmorphism) |
| Build | Vite (dev server, production bundler) |
| Containerisation | Docker (multi‑stage) |
| CI/CD | GitHub Actions – builds Docker image & pushes to GHCR |
| Static Hosting | Netlify (`netlify.toml`) |
| Version Control | Git + GitHub |

---

## 📂 Repository Structure
```text
clinicos-tunisia/
├─ src/               # React source files
│  ├─ components/    # UI components (Header, Sidebar, …)
│  ├─ pages/         # Application pages
│  └─ App.jsx        # Root component & routing
├─ public/            # Static assets & index.html
├─ Dockerfile         # Multi‑stage Docker build
├─ netlify.toml       # Netlify build configuration
├─ .github/workflows/docker-publish.yml  # GitHub Actions CI
├─ README.md          # *This file* – project pitch & docs
└─ PROJECT_OVERVIEW.md # Detailed overview (auto‑generated)
```

---

## 🚀 Get Started (Local Development)
```bash
# Clone the repo
git clone https://github.com/aminzairi/clinicos-tunisia.git
cd clinicos-tunisia

# Install deps
npm install

# Run dev server (HMR)
npm run dev   # http://localhost:5173

# Build for production
npm run build   # outputs to ./dist
```

---

## 📦 Production Deployment
### Docker (recommended for servers)
```bash
# Pull the pre‑built image from GHCR
docker pull ghcr.io/aminzairi/clinicos-tunisia:latest

# Run it
docker run -d -p 80:80 --name clinicos-tunisia ghcr.io/aminzairi/clinicos-tunisia:latest
```
Visit `http://<host>`.

### Netlify (static site)
1. Sign in → **New site from Git** → connect `aminzairi/clinicos-tunisia`.
2. Netlify auto‑detects `netlify.toml` and runs:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
3. Click **Deploy site** – your app will be live at a Netlify sub‑domain.

---

## 🔐 Credentials (pre‑seeded)
| Role | Username | Password |
|------|----------|----------|
| **Doctor** | `doc` | `1234` |
| **Secretary** | `sec` | `0000` |

*The login logic includes a lock‑out after 3 failed attempts (5‑minute cooldown).*

---

## 🤝 Contributing
Feel free to fork, open issues, or submit PRs. Follow the standard GitHub flow:
```bash
git checkout -b feature/awesome-feature
# make changes
git commit -m "feat: describe your change"
git push origin feature/awesome-feature
# open a PR
```

---

## 📄 License
MIT – see `LICENSE` file.

---

*For a deeper dive, see the auto‑generated [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md).*
