import Link from "next/link";
import { getRecipeAction } from "@/modules/recipe/actions/getRecipeAction";
import { recipeImageRepository } from "@/modules/image-generation/repositories/recipeImageRepository";
import { DishImageSection } from "./components/DishImageSection";
import { AppHeader } from "@/components/AppHeader";
import { ArrowLeft, Clock } from "lucide-react";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getRecipeAction(id);

  if (!result.success) {
    return (
      <>
        <AppHeader />
        <main className="flex flex-1 items-start justify-center px-4 py-10">
          <div className="w-full max-w-2xl space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {result.error}
            </div>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to recipes
            </Link>
          </div>
        </main>
      </>
    );
  }

  const recipe = result.data;
  const existingImage = await recipeImageRepository.findByRecipeId(recipe.id);

  return (
    <>
      <AppHeader />
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-8">
          {/* Back */}
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            My Recipes
          </Link>

          {/* Title block */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              {recipe.title}
            </h1>
            <p className="text-zinc-500">{recipe.description}</p>
            <p className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Ingredients
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border border-orange-100 bg-orange-50/60 px-3.5 py-2.5 text-sm"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                  <span className="font-medium text-zinc-800">{ing.name}</span>
                  <span className="ml-auto text-xs text-zinc-400">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Steps
            </h2>
            <ol className="space-y-3">
              {recipe.steps.map((s) => (
                <li
                  key={s.stepNumber}
                  className="flex gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-600">
                    {s.stepNumber}
                  </span>
                  <p className="pt-0.5 text-sm leading-relaxed text-zinc-700">
                    {s.instruction}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Dish image */}
          <DishImageSection recipeId={recipe.id} initialImage={existingImage} />
        </div>
      </main>
    </>
  );
}
