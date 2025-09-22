# Express Backend (Render)

Routes:
- `POST /login` → returns `{ token, user }` (JWT signed with `JWT_SECRET`).
- `POST /logout` → returns `{ ok: true }`.
- `GET /todos` → list (auth required)
- `POST /todos` → create (auth required) { text }
- `PUT /todos/:id` → update (auth required) { text?, completed? }
- `DELETE /todos/:id` → delete (auth required)

## Setup

```
cp .env.example .env
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:4001
```

## Deploy to Render
- Create a **Web Service**.
- Build command: `pnpm install && pnpm build`
- Start command: `node dist/index.js`
- Env vars: `PORT`, `JWT_SECRET`, `CORS_ORIGIN` (optional if only server-to-server calls).
