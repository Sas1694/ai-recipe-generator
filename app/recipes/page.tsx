import Link from "next/link";
import { listUserRecipesAction } from "@/modules/recipe/actions/listUserRecipesAction";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Plus } from "lucide-react";

export default async function RecipesPage() {
  const result = await listUserRecipesAction();

  return (
    <>
      <AppHeader />
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Recipes</h1>
            <Link href="/generate">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                New Recipe
              </Button>
            </Link>
          </div>

          {!result.success && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {result.error}
            </div>
          )}

          {result.success && result.data.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <ChefHat className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">No recipes yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a photo of your ingredients to generate your first recipe.
                </p>
              </div>
              <Link href="/generate">
                <Button className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Generate your first recipe
                </Button>
              </Link>
            </div>
          )}

          {result.success && result.data.length > 0 && (
            <div className="space-y-3">
              {result.data.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="block rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-semibold truncate">{recipe.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{recipe.ingredients.length} ingredients</Badge>
                    <Badge variant="secondary">{recipe.steps.length} steps</Badge>
                    <span className="ml-auto">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
