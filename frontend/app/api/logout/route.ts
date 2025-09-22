import { cookies } from 'next/headers';

export async function POST() {
  try {
    await fetch(`${process.env.BACKEND_URL}/logout`, { method: 'POST' }).catch(() => {});
  } catch {}
  const cookieName = process.env.JWT_COOKIE_NAME || 'token';
  (await cookies()).set(cookieName, '', { httpOnly: true, path: '/', maxAge: 0 });
  return Response.json({ ok: true });
}
