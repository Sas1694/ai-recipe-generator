import Link from "next/link";
import { auth } from "@/shared/auth/auth";
import { logoutAction } from "@/modules/auth/actions/logoutAction";
import { env } from "@/shared/config/env";
import { ChefHat, Sparkles, BookOpen, FlaskConical } from "lucide-react";

export async function AppHeader() {
  const session = await auth();
  const isMockAI = env.MOCK_AI === "true";

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <Link href="/generate" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15">
                <ChefHat className="h-4 w-4 text-orange-400" />
              </div>
              <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-zinc-100 sm:text-base">
                AI Recipe Generator
              </span>
            </Link>
            {isMockAI && (
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-400/15 px-2 py-1 text-xs font-semibold text-amber-300 sm:px-2.5">
                <FlaskConical className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Mock AI</span>
              </div>
            )}
          </div>
          <nav className="flex gap-1">
            <Link href="/generate" className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 sm:px-3">
              <Sparkles className="h-4 w-4 shrink-0 sm:hidden" />
              <span className="hidden sm:inline">Generate</span>
            </Link>
            <Link href="/recipes" className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 sm:px-3">
              <BookOpen className="h-4 w-4 shrink-0 sm:hidden" />
              <span className="hidden sm:inline">My Recipes</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.name && (
            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-orange-500/15 text-xs font-bold text-orange-400 sm:flex">
              {session.user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="cursor-pointer whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-white/18 hover:bg-white/8 hover:text-zinc-100 sm:px-4"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

