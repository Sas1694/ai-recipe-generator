"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { registerAction } from "@/modules/auth/actions/registerAction";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const tErrors = useTranslations("errors");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await registerAction(formData);
    if (result.success) {
      router.push("/auth/login?registered=true");
    } else {
      setError(tErrors(result.error as Parameters<typeof tErrors>[0]));
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
        <AnimatedSection delay={0} className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15">
              <ChefHat className="h-5 w-5 text-orange-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-100">
              {t("brand")}
            </span>
          </Link>
          <p className="text-sm text-zinc-500">{t("tagline")}</p>
        </AnimatedSection>

        <AnimatedSection delay={100} className="rounded-2xl border border-white/8 bg-zinc-900 p-7">
          <h1 className="text-lg font-semibold text-zinc-100">{t("register.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("register.subtitle")}</p>

          <form action={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                {t("register.nameLabel")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder={t("register.namePlaceholder")}
                required
                className="w-full rounded-xl border border-white/8 bg-zinc-800/60 px-4 py-2.5 text-base md:text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                {t("register.emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={t("register.emailPlaceholder")}
                required
                className="w-full rounded-xl border border-white/8 bg-zinc-800/60 px-4 py-2.5 text-base md:text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                {t("register.passwordLabel")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={6}
                placeholder={t("register.passwordPlaceholder")}
                required
                className="w-full rounded-xl border border-white/8 bg-zinc-800/60 px-4 py-2.5 text-base md:text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-orange-400 active:bg-orange-400 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("register.creating")}
                </>
              ) : (
                t("register.create")
              )}
            </button>
          </form>
        </AnimatedSection>

        <AnimatedSection delay={200} as="p" className="text-center text-sm text-zinc-600">
          {t("register.hasAccount")}{" "}
          <Link href="/auth/login" className="font-medium text-orange-400 transition-colors hover:text-orange-300 active:text-orange-300">
            {t("register.signIn")}
          </Link>
        </AnimatedSection>
      </div>
    </main>
  );
}


