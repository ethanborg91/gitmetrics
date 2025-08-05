'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [payload, setPayload] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPayload((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <section className="min-h-screen">
      <div>
        <input
          type="text"
          name="email"
          value={payload.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="password"
          name="password"
          value={payload.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full rounded border px-3 py-2"
        />
        <button>Login</button>
      </div>
    </section>
  );
}
