# Clinicos Tunisia – Project Overview

---

## 🌟 Quick Summary
A modern, role‑based medical clinic management web application built with **React** and **Vite**. It supports two user roles (Doctor & Secretary) with fine‑grained UI access, and can be deployed via **Docker** or as a **static site on Netlify**.

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, vanilla CSS (dark‑mode, glassmorphism) |
| **Build** | Vite (development server, production build) |
| **Containerisation** | Docker (multi‑stage build) |
| **CI/CD** | GitHub Actions – builds Docker image & pushes to GHCR |
| **Static Hosting** | Netlify (via `netlify.toml`) |
| **Version Control** | Git + GitHub |

---

## 🎨 UI Preview
![App Dashboard](file:///C:/Users/Zairi/.gemini/antigravity/brain/5ebbc7e4-f6fc-4a92-824c-913f04421fe2/app_screenshot_1785721759941.jpg)

---

## 📂 Repository Structure
```
clinicos-tunisia/
├─ src/               # React source files
│  ├─ components/    # UI components (Header, Sidebar, etc.)
│  ├─ pages/         # Application pages
│  └─ App.jsx        # Root component & routing
├─ public/            # Static assets & index.html
├─ Dockerfile         # Multi‑stage Docker build
├─ netlify.toml       # Netlify build configuration
├─ .github/workflows/docker-publish.yml  # GitHub Actions CI
└─ README.md          # Public README
```

---

## 🚀 Getting Started (Local Development)
```bash
# Clone the repo
git clone https://github.com/aminzairi/clinicos-tunisia.git
cd clinicos-tunisia

# Install dependencies
npm install

# Start dev server (HMR enabled)
npm run dev   # http://localhost:5173

# Build for production
npm run build   # outputs to ./dist
```

## 📦 Production Deployment
### Docker (recommended for server environments)
```bash
# Pull the pre‑built image (also built by GitHub Actions)
docker pull ghcr.io/aminzairi/clinicos-tunisia:latest

docker run -d -p 80:80 --name clinicos-tunisia ghcr.io/aminzairi/clinicos-tunisia:latest
```
Visit `http://<host>`.

### Netlify (static site)
1. Sign in to Netlify → **New site from Git** → connect the GitHub repo `aminzairi/clinicos-tunisia`.
2. Netlify auto‑detects `netlify.toml` and runs:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
3. Click **Deploy site** – your app will be live at a Netlify sub‑domain (e.g., `https://elegant-cassata-4239c7.netlify.app/`).

---

## 🔐 Credentials (pre‑seeded)
| Role | Username | Password |
|------|----------|----------|
| **Doctor** | `doc` | `doc` |
| **Secretary** | `sec` | `sec` |

---

## 📚 Documentation & Future Work
- **Role‑Based Access Control** – implemented via a simple context that reads `localStorage`. Extensible to JWT/OAuth.
- **Docker CI** – GitHub Actions automatically builds and pushes a Docker image on each commit to `main`.
- **Potential Enhancements**:
  - Add a real backend (Node/Express, Prisma, PostgreSQL) for persistent patient data.
  - Replace the local‑storage auth with OAuth2 (Google, Azure AD).
  - Introduce unit & integration tests (Jest, React Testing Library).

---

## 🤝 Contributing
Feel free to fork the repository, open issues, or submit pull requests. Follow the standard GitHub flow:
```bash
git checkout -b feature/your-feature
# make changes
git commit -m "feat: describe your change"
git push origin feature/your-feature
# open a PR
```

---

## 📄 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*This overview is kept up to date automatically after each deployment.*
