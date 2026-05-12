import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/shared/auth/auth";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getTranslations } from "next-intl/server";
import {
  Camera,
  ChefHat,
  Edit3,
  Image as ImageIcon,
  Sparkles,
  UtensilsCrossed,
  Leaf,
  Zap,
  ArrowRight,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/generate");
  }

  const t = await getTranslations("landing");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15">
              <ChefHat className="h-4 w-4 text-orange-400" />
            </div>
            <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-zinc-100 sm:text-base">
              {t("brand")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 sm:px-4 whitespace-nowrap"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/auth/register"
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-orange-400 hover:shadow-orange-400/30 sm:px-4 whitespace-nowrap"
            >
              {t("nav.getStarted")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.18) 0%, transparent 60%)",
                "radial-gradient(ellipse 50% 35% at 15% 70%, rgba(234,179,8,0.06) 0%, transparent 55%)",
                "radial-gradient(ellipse 50% 35% at 85% 20%, rgba(239,68,68,0.05) 0%, transparent 55%)",
              ].join(", "),
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-28 text-center sm:px-6 sm:py-36 lg:py-44">
            <AnimatedSection delay={0}>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-300">
                <Sparkles className="h-3 w-3" />
                {t("hero.badge")}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                {t("hero.h1Start")}{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  {t("hero.h1Highlight")}
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                {t("hero.descriptionPart1")}{" "}
                <span className="font-medium text-zinc-200">
                  {t("hero.descriptionBold")}
                </span>{" "}
                {t("hero.descriptionPart2")}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/auth/register"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-500/30 transition-all duration-200 hover:bg-orange-400 hover:shadow-orange-400/35 hover:-translate-y-px sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("hero.ctaFree")}
                </Link>
                <Link
                  href="/auth/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/6 px-8 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-zinc-100 sm:w-auto"
                >
                  {t("hero.ctaSignIn")}
                  <ArrowRight className="h-4 w-4 text-zinc-500" />
                </Link>
              </div>
              <p className="mt-5 text-xs text-zinc-600">
                {t("hero.disclaimer")}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-t border-white/6 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                {t("howItWorks.eyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                {t("howItWorks.title")}
              </h2>
              <p className="mt-4 text-zinc-400">{t("howItWorks.subtitle")}</p>
            </AnimatedSection>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  { icon: Camera, stepKey: "1", titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc" },
                  { icon: Edit3,  stepKey: "2", titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc" },
                  { icon: ChefHat, stepKey: "3", titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc" },
                  { icon: ImageIcon, stepKey: "4", titleKey: "howItWorks.step4Title", descKey: "howItWorks.step4Desc" },
                ] as const
              ).map(({ icon: Icon, stepKey, titleKey, descKey }, i) => (
                <AnimatedSection key={stepKey} delay={i * 100} className="group flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/8 transition-all duration-300 group-hover:border-orange-500/30 group-hover:bg-orange-500/15">
                      <Icon className="h-7 w-7 text-orange-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-[10px] font-bold text-white shadow-md shadow-orange-500/30">
                      {stepKey}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{t(descKey)}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why use it ── */}
        <section className="border-t border-white/6 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                {t("whyUseIt.eyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                {t("whyUseIt.title")}
              </h2>
              <p className="mt-4 text-zinc-400">
                {t("whyUseIt.subtitle")}
              </p>
            </AnimatedSection>

            <div className="mt-16 grid gap-5 sm:grid-cols-3">
              {(
                [
                  { icon: UtensilsCrossed, titleKey: "whyUseIt.feature1Title", descKey: "whyUseIt.feature1Desc" },
                  { icon: Leaf, titleKey: "whyUseIt.feature2Title", descKey: "whyUseIt.feature2Desc" },
                  { icon: Zap, titleKey: "whyUseIt.feature3Title", descKey: "whyUseIt.feature3Desc" },
                ] as const
              ).map(({ icon: Icon, titleKey, descKey }, i) => (
                <AnimatedSection
                  key={titleKey}
                  delay={i * 100}
                  className="group rounded-2xl border border-white/8 bg-zinc-900 p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/25 hover:shadow-[0_12px_40px_rgba(249,115,22,0.1)]"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/10 transition-colors duration-200 group-hover:bg-orange-500/15">
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-zinc-100">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{t(descKey)}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="border-t border-white/6 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <AnimatedSection className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-zinc-900 to-amber-500/8 p-12 text-center">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
                style={{ background: "rgba(249,115,22,0.15)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl"
                style={{ background: "rgba(234,179,8,0.10)" }}
              />
              <div className="relative">
                <span className="text-5xl" role="img" aria-label="plate">🍽️</span>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-100">
                  {t("cta.title")}
                </h2>
                <p className="mt-4 text-zinc-400">
                  {t("cta.subtitle")}
                </p>
                <Link
                  href="/auth/register"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-500/30 transition-all duration-200 hover:bg-orange-400 hover:shadow-orange-400/35 hover:-translate-y-px"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("cta.button")}
                </Link>
                <p className="mt-4 text-xs text-zinc-600">{t("cta.disclaimer")}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-zinc-600" />
            <span className="text-sm font-medium text-zinc-600">{t("footer.brand")}</span>
          </div>
          <p className="text-sm text-zinc-700">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}

