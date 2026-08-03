# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Deployment

### Docker (already configured)
The repository includes a `Dockerfile` and a GitHub Actions workflow that build and push a Docker image to GitHub Container Registry.

### Netlify (static site)
You can deploy this Vite app to Netlify as a static site.

1. Sign in to Netlify and click **New site from Git**.
2. Connect the GitHub repository `aminzairi/clinicos-tunisia`.
3. In the **Build settings** set:
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy site**. Netlify will run the build and serve the site.

Alternatively, add a `netlify.toml` file (already present) to configure the build automatically:

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Commit any changes and push; Netlify will pick up the configuration on the next deploy.

---

Login credentials (pre‑seeded):

- Doctor: `doc` / `doc`
- Secretary: `sec` / `sec`
