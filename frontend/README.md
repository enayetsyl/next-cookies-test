# Next.js Frontend (Vercel)

- Public routes: `/`, `/login`
- Protected route: `/dashboard` (guarded by `middleware.ts` checking an HttpOnly cookie).
- API routes under `/app/api/*` proxy requests to the backend and attach `Authorization: Bearer <token>` by reading the cookie server-side.

## Setup

```
cp .env.example .env.local
# edit BACKEND_URL to your Render API URL in prod
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
```

### Environment

- `BACKEND_URL` — the Express backend URL (e.g., local `http://localhost:4001` or Render URL)
- `JWT_COOKIE_NAME` — defaults to `token`

## Deploy

- **Vercel**: add env vars in your project (`BACKEND_URL`, `JWT_COOKIE_NAME`).
- Because the browser talks only to Next API, you don't need CORS in the backend for prod.
