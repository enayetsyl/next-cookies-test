import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { authMiddleware, type AuthedRequest } from './middleware/auth.js';
import { todosRouter } from './routes/todos.js';

const app = express();
app.use(express.json());

// You can relax CORS since frontend calls the backend via Next server (server-to-server) in prod.
// But we keep it here for local testing if you call directly from the browser.
const origins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => cb(null, true), // allow all for demo
  credentials: true,
}));

app.get('/health', (_req, res) => res.json({ ok: true }));

// ---- Auth endpoints ----
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

app.post('/login', (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid credentials' });

  const { email } = parsed.data;

  // DEMO USER ONLY
  const userId = 'u1';
  const role = 'USER';

  const token = jwt.sign({ sub: userId, email, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return res.json({ token, user: { id: userId, email, role } });
});

app.post('/logout', (_req, res) => {
  // Stateless JWT: nothing to invalidate server-side in this simple demo.
  return res.json({ ok: true });
});

// ---- Protected todos CRUD ----
app.use('/todos', authMiddleware as any, todosRouter);

const port = Number(process.env.PORT || 4001);
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
