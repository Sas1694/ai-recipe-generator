import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/shared/auth/auth";
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

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15">
              <ChefHat className="h-4 w-4 text-orange-400" />
            </div>
            <span className="text-base font-semibold tracking-tight text-zinc-100">
              AI Recipe Generator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-orange-400 hover:shadow-orange-400/30"
            >
              Get started
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
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-300">
              <Sparkles className="h-3 w-3" />
              Your AI sous-chef is ready
            </div>

            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Cook with what you{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                already have
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Snap a photo of your fridge or pantry.{" "}
              <span className="font-medium text-zinc-200">
                Our AI detects your ingredients
              </span>{" "}
              and crafts a personalized recipe — in seconds.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-500/30 transition-all duration-200 hover:bg-orange-400 hover:shadow-orange-400/35 hover:-translate-y-px sm:w-auto"
              >
                <Sparkles className="h-4 w-4" />
                Start for free
              </Link>
              <Link
                href="/auth/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/6 px-8 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-zinc-100 sm:w-auto"
              >
                Sign in
                <ArrowRight className="h-4 w-4 text-zinc-500" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-zinc-600">
              No credit card required · Free to use
            </p>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-t border-white/6 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                From fridge to plate in 4 steps
              </h2>
              <p className="mt-4 text-zinc-400">No meal planning needed. Just a photo.</p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Camera,
                  step: "1",
                  title: "Snap a photo",
                  description:
                    "Point your camera at your fridge, pantry, or counter. Anything visible counts.",
                },
                {
                  icon: Edit3,
                  step: "2",
                  title: "Review ingredients",
                  description:
                    "AI lists what it sees. Remove mistakes, add what's missing — you stay in control.",
                },
                {
                  icon: ChefHat,
                  step: "3",
                  title: "Get your recipe",
                  description:
                    "A real, cookable recipe is generated using only what you confirmed.",
                },
                {
                  icon: ImageIcon,
                  step: "4",
                  title: "See the dish",
                  description:
                    "Generate a stunning AI photo of the finished dish to spark inspiration.",
                },
              ].map(({ icon: Icon, step, title, description }) => (
                <div key={step} className="group flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/8 transition-all duration-300 group-hover:border-orange-500/30 group-hover:bg-orange-500/15">
                      <Icon className="h-7 w-7 text-orange-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-[10px] font-bold text-white shadow-md shadow-orange-500/30">
                      {step}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why use it ── */}
        <section className="border-t border-white/6 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                Why use it
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                Smart cooking, zero waste
              </h2>
              <p className="mt-4 text-zinc-400">
                Built for real kitchens, real ingredients, real people.
              </p>
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: UtensilsCrossed,
                  title: "Use what you have",
                  description:
                    "No more wasted groceries. Turn what's already in your kitchen into a delicious meal.",
                },
                {
                  icon: Leaf,
                  title: "Reduce food waste",
                  description:
                    "Make the most of every ingredient. Help the environment while enjoying great food.",
                },
                {
                  icon: Zap,
                  title: "Ready in seconds",
                  description:
                    "From photo upload to complete recipe in under 30 seconds. AI does the heavy lifting.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-white/8 bg-zinc-900 p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/25 hover:shadow-[0_12px_40px_rgba(249,115,22,0.1)]"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/10 transition-colors duration-200 group-hover:bg-orange-500/15">
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-zinc-100">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="border-t border-white/6 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-zinc-900 to-amber-500/8 p-12 text-center">
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
                  Ready to cook something amazing?
                </h2>
                <p className="mt-4 text-zinc-400">
                  Join home cooks who waste less, cook more, and actually enjoy figuring out dinner.
                </p>
                <Link
                  href="/auth/register"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-500/30 transition-all duration-200 hover:bg-orange-400 hover:shadow-orange-400/35 hover:-translate-y-px"
                >
                  <Sparkles className="h-4 w-4" />
                  Create your free account
                </Link>
                <p className="mt-4 text-xs text-zinc-600">Takes 30 seconds to sign up</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-zinc-600" />
            <span className="text-sm font-medium text-zinc-600">AI Recipe Generator</span>
          </div>
          <p className="text-sm text-zinc-700">
            © {new Date().getFullYear()} · Built with Next.js &amp; OpenAI
          </p>
        </div>
      </footer>
    </div>
  );
}
