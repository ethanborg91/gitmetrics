import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = request.headers.get('authorization');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/generate-cli-token`, {
    method: 'GET',
    headers: {
      Authorization: token || '',
    },
  });

  if (!response.ok)
    return NextResponse.json({ error: 'Failed to generate token' }, { status: response.status });
  return NextResponse.json(await response.json());
}
