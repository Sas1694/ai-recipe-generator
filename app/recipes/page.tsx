import Link from "next/link";
import { listUserRecipesAction } from "@/modules/recipe/actions/listUserRecipesAction";
import { AppHeader } from "@/components/AppHeader";
import { ChefHat, Plus, Clock, Layers } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export default async function RecipesPage() {
  const result = await listUserRecipesAction();

  return (
    <>
      <AppHeader />
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <AnimatedSection className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                My Recipes
              </h1>
              {result.success && result.data.length > 0 && (
                <p className="mt-0.5 text-sm text-zinc-500">
                  {result.data.length} recipe
                  {result.data.length !== 1 ? "s" : ""} saved
                </p>
              )}
            </div>
            <Link
              href="/generate"
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-400"
            >
              <Plus className="h-4 w-4" />
              New Recipe
            </Link>
          </AnimatedSection>

          {/* Error */}
          {!result.success && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {result.error}
            </div>
          )}

          {/* Empty state */}
          {result.success && result.data.length === 0 && (
            <AnimatedSection delay={100} className="flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                <ChefHat className="h-8 w-8 text-orange-400" />
              </div>
              <div>
                <p className="font-semibold text-zinc-800">No recipes yet</p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-zinc-500">
                  Upload a photo of your ingredients and let AI turn them into a
                  delicious recipe.
                </p>
              </div>
              <Link
                href="/generate"
                className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-400"
              >
                <Plus className="h-4 w-4" />
                Generate your first recipe
              </Link>
            </AnimatedSection>
          )}

          {/* Recipe list */}
          {result.success && result.data.length > 0 && (
            <div className="space-y-3">
              {result.data.map((recipe, i) => (
                <AnimatedSection key={recipe.id} delay={i * 60}>
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="group block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-orange-200 hover:shadow-[0_4px_20px_rgba(249,115,22,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-zinc-900 transition-colors group-hover:text-orange-600">
                        {recipe.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                        {recipe.description}
                      </p>
                    </div>
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 transition-colors group-hover:bg-orange-100">
                      <ChefHat className="h-4 w-4 text-orange-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {recipe.ingredients.length} ingredients
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {recipe.steps.length} steps
                    </span>
                    <span className="ml-auto">
                      {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
