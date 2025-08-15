'use server'; // This makes all exports Server Actions

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Ensure this is set

export async function loginAction(_prevState: { message: string } | undefined, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Please fill in all fields' };
  }

  try {
    const formBody = new URLSearchParams({
      username: email,
      password,
      grant_type: 'password',
    });

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const { access_token } = await response.json();

    if (!access_token || typeof access_token !== 'string') {
      throw new Error('Invalid or missing token in response');
    }

    const cookieStore = await cookies();
    cookieStore.set('authToken', access_token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Set to true for max security; but then proxy APIs or use /api/auth/me for all client needs
      sameSite: 'strict',
      path: '/',
      // maxAge: 3600, // Add expiry if needed (e.g., 1 hour)
    });
  } catch (error: any) {
    return { message: error.message || 'Login failed' };
  }

  return { success: true, message: '' };
}

// Similar for signup
export async function signupAction(
  _prevState: { message: string } | undefined,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Please fill in all fields' };
  }

  try {
    const formBody = new URLSearchParams({
      username: email,
      password,
      grant_type: 'password',
    });

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Signup failed');
    }

    const { access_token } = await response.json();

    if (!access_token || typeof access_token !== 'string') {
      throw new Error('Invalid or missing token in response');
    }

    const cookieStore = await cookies();
    cookieStore.set('authToken', access_token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Set to true for max security; but then proxy APIs or use /api/auth/me for all client needs
      sameSite: 'strict',
      path: '/',
      // maxAge: 3600, // Add expiry if needed (e.g., 1 hour)
    });
  } catch (error: any) {
    return { message: error.message || 'Signup failed' };
  }

  return { success: true, message: '' };
}

// For logout (call from client)
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
  redirect('/login'); // Or '/'
}
