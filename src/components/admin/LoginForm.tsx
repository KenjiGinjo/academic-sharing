"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(false);

    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(fd.get("email") ?? "").trim().toLowerCase(),
      password: String(fd.get("password") ?? ""),
      callbackUrl: "/admin",
      redirect: false,
    });

    if (res?.error) {
      setError(true);
      setPending(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {error ? (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          Email or password is wrong.
        </p>
      ) : null}
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded border border-border bg-background px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Password</span>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded border border-border bg-background px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
