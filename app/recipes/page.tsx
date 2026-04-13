import Link from "next/link";
import { listUserRecipesAction } from "@/modules/recipe/actions/listUserRecipesAction";

export default async function RecipesPage() {
  const result = await listUserRecipesAction();

  return (
    <main className="flex min-h-full items-start justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Recipes</h1>
          <Link
            href="/generate"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Generate New
          </Link>
        </div>

        {!result.success && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {result.error}
          </div>
        )}

        {result.success && result.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/50">No recipes yet.</p>
            <Link
              href="/generate"
              className="mt-2 inline-block text-sm font-medium underline underline-offset-4 hover:opacity-80"
            >
              Generate your first recipe
            </Link>
          </div>
        )}

        {result.success && result.data.length > 0 && (
          <div className="space-y-4">
            {result.data.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="block rounded-lg border border-foreground/10 p-4 transition-colors hover:bg-foreground/5"
              >
                <h2 className="font-semibold">{recipe.title}</h2>
                <p className="mt-1 text-sm text-foreground/60 line-clamp-2">
                  {recipe.description}
                </p>
                <p className="mt-2 text-xs text-foreground/40">
                  {recipe.ingredients.length} ingredients ·{" "}
                  {recipe.steps.length} steps ·{" "}
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
