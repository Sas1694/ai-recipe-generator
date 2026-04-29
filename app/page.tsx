import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/shared/auth/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  ChefHat,
  Edit3,
  Image as ImageIcon,
  Sparkles,
  UtensilsCrossed,
  Leaf,
  Zap,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/generate");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            <span className="text-lg font-bold">AI Recipe Generator</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6 gap-1.5">
                <Sparkles className="h-3 w-3" />
                Powered by AI
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Cook with what you{" "}
                <span className="text-primary">already have</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                Upload a photo of your fridge or pantry. Our AI detects your
                ingredients and generates a personalized recipe — in seconds.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    <Sparkles className="h-4 w-4" />
                    Start for free
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* How it works */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-muted-foreground">
                From photo to plate in four simple steps.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Camera,
                  step: "1",
                  title: "Upload a photo",
                  description:
                    "Take a photo of your fridge, pantry, or ingredients and upload it.",
                },
                {
                  icon: Edit3,
                  step: "2",
                  title: "Review ingredients",
                  description:
                    "AI detects what's in the photo. You confirm, add, or remove items.",
                },
                {
                  icon: ChefHat,
                  step: "3",
                  title: "Generate recipe",
                  description:
                    "A professional recipe is created using only your confirmed ingredients.",
                },
                {
                  icon: ImageIcon,
                  step: "4",
                  title: "Visualize the dish",
                  description:
                    "Generate a stunning AI image of the finished dish to inspire you.",
                },
              ].map(({ icon: Icon, step, title, description }) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {step}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Value proposition */}
        <section className="bg-muted/40 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why AI Recipe Generator?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Smart cooking for everyone.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-3">
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
                  title: "Lightning fast",
                  description:
                    "From photo upload to complete recipe in under 30 seconds. AI does the heavy lifting.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border bg-card p-6 shadow-sm"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-10 text-center shadow-sm">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to cook smarter?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Join thousands of home cooks who use AI to make the most of
                their ingredients every day.
              </p>
              <Link href="/auth/register" className="mt-8 inline-block">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Create your free account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          <p>© {new Date().getFullYear()} AI Recipe Generator. Built with Next.js and OpenAI.</p>
        </div>
      </footer>
    </div>
  );
}
