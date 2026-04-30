"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/modules/auth/actions/registerAction";
import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await registerAction(formData);
    if (result.success) {
      router.push("/auth/login?registered=true");
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(249,115,22,0.10) 0%, transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15">
              <ChefHat className="h-5 w-5 text-orange-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-100">
              AI Recipe Generator
            </span>
          </Link>
          <p className="text-sm text-zinc-500">Turn your fridge into a feast</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-zinc-900 p-7">
          <h1 className="text-lg font-semibold text-zinc-100">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-500">Start generating recipes with AI — it&apos;s free.</p>

          <form action={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="w-full rounded-xl border border-white/8 bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full rounded-xl border border-white/8 bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={6}
                placeholder="At least 6 characters"
                required
                className="w-full rounded-xl border border-white/8 bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-orange-400 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-orange-400 transition-colors hover:text-orange-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
