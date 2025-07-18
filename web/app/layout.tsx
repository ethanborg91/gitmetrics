import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GitMetrics',
  description: 'Your Git Analytics Tool',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50 text-gray-900 antialiased dark:bg-gray-800 dark:text-white">
        <header className="bg-white shadow dark:bg-gray-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <h1 className="text-xl font-semibold">
              <a href="/">GitMetrics</a>
            </h1>
            <nav className="space-x-4">
              <a href="/login" className="text-sm hover:underline">
                Log in
              </a>
              <a
                href="/signup"
                className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Sign up
              </a>
            </nav>
          </div>
        </header>

        <main className="max-w-7x1 mx-auto px-4 py-10">{children}</main>

        <footer className="border-t bg-gray-100 py-6 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-white">
          © {new Date().getFullYear()} GitMetrics
        </footer>
      </body>
    </html>
  );
}
