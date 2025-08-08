import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export async function GET() {
  // @ts-ignore - TS doesn't recognize mutations on ReadonlyRequestCookies yet
  const token = cookies().get('authToken')?.value;

  console.log(token);

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = jwtDecode<{ sub: string }>(token);
    return NextResponse.json({ email: decoded.sub });
  } catch (error) {
    // @ts-ignore - TS doesn't recognize mutations on ReadonlyRequestCookies yet
    cookies().delete('authToken'); // Clean up invalid token
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
