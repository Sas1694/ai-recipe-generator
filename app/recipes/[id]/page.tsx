import Link from "next/link";
import { getRecipeAction } from "@/modules/recipe/actions/getRecipeAction";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getRecipeAction(id);

  if (!result.success) {
    return (
      <main className="flex min-h-full items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {result.error}
          </div>
          <Link
            href="/recipes"
            className="inline-block text-sm font-medium underline underline-offset-4 hover:opacity-80"
          >
            ← Back to recipes
          </Link>
        </div>
      </main>
    );
  }

  const recipe = result.data;

  return (
    <main className="flex min-h-full items-start justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <Link
            href="/recipes"
            className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            ← Back to recipes
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <p className="text-foreground/70">{recipe.description}</p>
          <p className="text-xs text-foreground/40">
            Created {new Date(recipe.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Ingredients</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="rounded-md border border-foreground/10 px-3 py-2 text-sm"
              >
                <span className="font-medium">{ing.name}</span>
                <span className="text-foreground/50">
                  {" "}
                  — {ing.quantity} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Steps</h2>
          <ol className="space-y-3">
            {recipe.steps.map((s) => (
              <li
                key={s.stepNumber}
                className="flex gap-3 rounded-md border border-foreground/10 p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  {s.stepNumber}
                </span>
                <p className="text-sm leading-relaxed">{s.instruction}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Phase 5: Generate dish image button will go here */}
      </div>
    </main>
  );
}
