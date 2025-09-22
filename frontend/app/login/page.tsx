'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      const nextUrl = new URL(window.location.href).searchParams.get('next') || '/dashboard';
      window.location.assign(nextUrl);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || 'Login failed');
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{display:'grid', gap:12, maxWidth:360}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {error && <p style={{color:'crimson'}}>{error}</p>}
    </main>
  );
}
