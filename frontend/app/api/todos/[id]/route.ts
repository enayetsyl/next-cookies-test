import { cookies } from 'next/headers';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = (await cookies()).get(process.env.JWT_COOKIE_NAME || 'token')?.value;
  const body = await req.text();
  const res = await fetch(`${process.env.BACKEND_URL}/todos/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const token = (await cookies()).get(process.env.JWT_COOKIE_NAME || 'token')?.value;
  const res = await fetch(`${process.env.BACKEND_URL}/todos/${params.id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}
