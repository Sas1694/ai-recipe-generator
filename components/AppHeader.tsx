import Link from "next/link";
import { auth } from "@/shared/auth/auth";
import { logoutAction } from "@/modules/auth/actions/logoutAction";
import { ChefHat } from "lucide-react";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/generate" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15">
              <ChefHat className="h-4 w-4 text-orange-400" />
            </div>
            <span className="text-base font-semibold tracking-tight text-zinc-100">
              AI Recipe Generator
            </span>
          </Link>
          <nav className="hidden gap-1 sm:flex">
            <Link
              href="/generate"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Generate
            </Link>
            <Link
              href="/recipes"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              My Recipes
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
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-white/18 hover:bg-white/8 hover:text-zinc-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

