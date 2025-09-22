import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import type { AuthedRequest } from '../middleware/auth.js';

type Todo = { id: string; text: string; completed: boolean };

// In-memory store keyed by user id
const store = new Map<string, Todo[]>();

export const todosRouter = Router();

todosRouter.get('/', (req: AuthedRequest, res) => {
  const uid = req.user!.sub;
  const todos = store.get(uid) || [];
  res.json(todos);
});

const CreateSchema = z.object({ text: z.string().min(1) });
todosRouter.post('/', (req: AuthedRequest, res) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid body' });
  const uid = req.user!.sub;
  const todos = store.get(uid) || [];
  const todo = { id: randomUUID(), text: parsed.data.text, completed: false };
  todos.push(todo);
  store.set(uid, todos);
  res.status(201).json(todo);
});

const UpdateSchema = z.object({ text: z.string().min(1).optional(), completed: z.boolean().optional() });
todosRouter.put('/:id', (req: AuthedRequest, res) => {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid body' });
  const uid = req.user!.sub;
  const todos = store.get(uid) || [];
  const idx = todos.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  todos[idx] = { ...todos[idx], ...parsed.data };
  res.json(todos[idx]);
});

todosRouter.delete('/:id', (req: AuthedRequest, res) => {
  const uid = req.user!.sub;
  const todos = store.get(uid) || [];
  const idx = todos.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const [removed] = todos.splice(idx, 1);
  store.set(uid, todos);
  res.json(removed);
});
