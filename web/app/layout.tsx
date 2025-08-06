import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '../components/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GitMetrics',
  description: 'Your Git Analytics Tool',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50 text-gray-900 antialiased dark:bg-gray-800 dark:text-white">
        <AuthProvider>
          <header className="bg-white shadow dark:bg-gray-900">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <h1 className="text-xl font-semibold">
                <a href="/">GitMetrics</a>
              </h1>
              <Nav />
            </div>
          </header>
          <main className="max-w-7x1 mx-auto px-4 py-10">{children}</main>
          <footer className="border-t bg-gray-100 py-6 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-white">
            © {new Date().getFullYear()} GitMetrics
          </footer>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
