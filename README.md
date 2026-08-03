# Clinicos Tunisia (React + Vite)

This repository contains a modern React application built with Vite, featuring role‑based access control (Doctor / Secretary) and a Dockerized production build. The code is ready for deployment on both Docker‑based platforms and static‑site hosts.

## Features
- Role‑based UI (Doctor sees all tabs, Secretary sees a restricted view)
- Pre‑seeded credentials: `doc`/`doc` for Doctor, `sec`/`sec` for Secretary
- Dockerfile for container deployment
- GitHub Actions workflow that builds and pushes an image to GitHub Container Registry
- Netlify configuration (`netlify.toml`) for static‑site deployment

## Deployment

### Docker (already configured)
The repository includes a `Dockerfile` and a GitHub Actions workflow that build and push a Docker image to GitHub Container Registry. You can pull and run the image with:
```
 docker pull ghcr.io/aminzairi/clinicos-tunisia:latest
 docker run -d -p 80:80 --name clinicos-tunisia ghcr.io/aminzairi/clinicos-tunisia:latest
```

### Netlify (static site)
You can deploy this Vite app to Netlify as a static site.

1. Sign in to Netlify and click **New site from Git**.
2. Connect the GitHub repository `aminzairi/clinicos-tunisia`.
3. In the **Build settings** set:
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy site**. Netlify will run the build and serve the site.

The repository already contains a `netlify.toml` file that configures the build automatically:
```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Public URL
The application is publicly accessible at:

```
https://elegant-cassata-4239c7.netlify.app/
```

Open the URL in any browser and log in with the credentials listed above.

---

### Login credentials (pre‑seeded)
- **Doctor**: `doc` / `doc`
- **Secretary**: `sec` / `sec`
