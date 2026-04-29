import Link from "next/link";
import { getRecipeAction } from "@/modules/recipe/actions/getRecipeAction";
import { recipeImageRepository } from "@/modules/image-generation/repositories/recipeImageRepository";
import { DishImageSection } from "./components/DishImageSection";
import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

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
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {result.error}
            </div>
            <Link href="/recipes">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                Back to recipes
              </Button>
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
          <Link href="/recipes">
            <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to recipes
            </Button>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            <p className="text-muted-foreground">{recipe.description}</p>
            <p className="text-xs text-muted-foreground">
              Created {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ingredients</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm shadow-sm"
                >
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {ing.quantity} {ing.unit}
                  </Badge>
                  <span className="font-medium">{ing.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Steps</h2>
            <ol className="space-y-3">
              {recipe.steps.map((s) => (
                <li
                  key={s.stepNumber}
                  className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {s.stepNumber}
                  </span>
                  <p className="text-sm leading-relaxed pt-0.5">{s.instruction}</p>
                </li>
              ))}
            </ol>
          </div>

          <Separator />

          <DishImageSection recipeId={recipe.id} initialImage={existingImage} />
        </div>
      </main>
    </>
  );
}

