import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).get(process.env.JWT_COOKIE_NAME || 'token')?.value;
  const res = await fetch(`${process.env.BACKEND_URL}/todos`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store',
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}

export async function POST(req: Request) {
  const token = (await cookies()).get(process.env.JWT_COOKIE_NAME || 'token')?.value;
  const body = await req.text();
  const res = await fetch(`${process.env.BACKEND_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}
