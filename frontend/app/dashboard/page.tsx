'use client';

import { useEffect, useState } from 'react';

type Todo = { id: string; text: string; completed: boolean };

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  async function refresh() {
    const res = await fetch('/api/todos', { cache: 'no-store' });
    if (res.ok) setTodos(await res.json());
  }

  useEffect(() => { refresh(); }, []);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setText('');
    refresh();
  }

  async function toggleTodo(id: string, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    refresh();
  }

  async function removeTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    refresh();
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.assign('/login');
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={logout} style={{marginBottom:16}}>Logout</button>
      <form onSubmit={addTodo} style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="New todo..." value={text} onChange={e=>setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul style={{display:'grid', gap:8, padding:0, listStyle:'none'}}>
        {todos.map(t => (
          <li key={t.id} style={{display:'flex', alignItems:'center', gap:8}}>
            <input type="checkbox" checked={t.completed} onChange={()=>toggleTodo(t.id, t.completed)} />
            <span style={{textDecoration: t.completed ? 'line-through' : 'none'}}>{t.text}</span>
            <button onClick={()=>removeTodo(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
