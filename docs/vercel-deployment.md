# Vercel deployment configuration

This repository is a **Next.js** application, not a static `public`-directory site. `vercel.json` explicitly selects the `nextjs` framework.

## Required Vercel dashboard settings

Under **Project → Settings → Build and Deployment**:

- **Framework Preset:** `Next.js`
- **Build Command:** `next build` (or leave the framework default)
- **Output Directory:** **clear any `public` override** and use the framework default; do not force static export
- **Root Directory:** repository root (unless the repository has been moved into a monorepo)

Redeploy the PR preview after verifying these settings. `next build` succeeding is not enough: the Vercel deployment must finish and `/api/maplibre/[asset]` must remain available as a dynamic route.

### Failure signature

`[STATIC_BUILD_NO_OUT_DIR] No Output Directory named "public" found after the Build completed` indicates a static output-directory selection outside the standard Next.js deployment flow. Creating an empty `public/` folder is **not** a correct fix; it would not solve the deployment configuration and can hide the dynamic API route.

See issue #148. Keep the issue open until the project owner confirms the successful deployment.
