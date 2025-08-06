'use client';

import { useAuth } from '../app/context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav className="space-x-4">
      {user ? (
        <>
          <span className="text-sm">Welcome, {user.email}</span>
          <button onClick={logout} className="text-sm hover:underline">
            Logout
          </button>
        </>
      ) : (
        <>
          <a href="/login" className="text-sm hover:underline">
            Log in
          </a>
          <a
            href="/signup"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign up
          </a>
        </>
      )}
    </nav>
  );
}
