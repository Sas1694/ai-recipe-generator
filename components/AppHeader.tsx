import Link from "next/link";
import { auth } from "@/shared/auth/auth";
import { logoutAction } from "@/modules/auth/actions/logoutAction";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/generate" className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            <span className="font-bold">AI Recipe Generator</span>
          </Link>
          <nav className="hidden gap-1 sm:flex">
            <Link href="/generate">
              <Button variant="ghost" size="sm">
                Generate
              </Button>
            </Link>
            <Link href="/recipes">
              <Button variant="ghost" size="sm">
                My Recipes
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.name && (
            <span className="hidden text-sm text-muted-foreground sm:block">
              {session.user.name}
            </span>
          )}
          <form action={logoutAction}>
            <Button variant="outline" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
