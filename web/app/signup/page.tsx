'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function SignupPage() {
  const [payload, setPayload] = useState({ email: '', password: '' });
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPayload((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payload.email || !payload.password) {
      toast.error('Please fill in all fields');
      return;
    }
    await signup(payload.email, payload.password);
  };

  return (
    <section className="pb-50 flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="rounded bg-white p-6 shadow-md dark:bg-gray-900">
        <input
          type="email"
          name="email"
          value={payload.email}
          onChange={handleChange}
          placeholder="Email"
          className="mb-4 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="password"
          name="password"
          value={payload.password}
          onChange={handleChange}
          placeholder="Password"
          className="mb-4 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </section>
  );
}
