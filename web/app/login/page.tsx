'use client';
import { useEffect, useActionState } from 'react';
import { toast } from 'react-toastify';
import { loginAction } from '../actions/auth';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, { message: '' });

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <section className="pb-50 flex min-h-screen items-center justify-center">
      <form action={formAction} className="rounded bg-white p-6 shadow-md dark:bg-gray-900">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-4 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="mb-4 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          {pending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </section>
  );
}
