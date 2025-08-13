import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  console.log(token);

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = jwtDecode<{ sub: string }>(token);
    return NextResponse.json({ email: decoded.sub });
  } catch (error) {
    cookieStore.delete('authToken'); // Clean up invalid token
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
