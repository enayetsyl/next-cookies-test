import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${process.env.BACKEND_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    return Response.json({ message: data?.message || 'Login failed' }, { status: res.status });
  }

  const token = data?.token as string | undefined;
  if (!token) {
    return Response.json({ message: 'No token returned from backend' }, { status: 500 });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = process.env.JWT_COOKIE_NAME || 'token';
  (await cookies()).set({
    name: cookieName,
    value: token,
    httpOnly: true,
    sameSite: isProd ? 'lax' : 'lax',
    secure: isProd,
    path: '/',
    maxAge: 60 * 60, // 1h
  });

  return Response.json({ ok: true });
}
