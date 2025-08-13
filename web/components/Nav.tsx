'use client';

import { useAuth } from '../app/context/AuthContext';

export default function Nav() {
  const { user, logout, loading } = useAuth();

  // Don't render anything while auth is loading to prevent flash
  if (loading) {
    return (
      <nav className="space-x-4">
        <div className="h-6 w-24 animate-pulse bg-gray-200 rounded dark:bg-gray-700"></div>
      </nav>
    );
  }

  return (
    <nav className="space-x-4">
      {user ? (
        <>
          <span className="text-sm">Welcome, {user.email}</span>
          <button onClick={logout} className="cursor-pointer text-sm hover:underline">
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
