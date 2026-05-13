"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { generateDishImageAction } from "@/modules/image-generation/actions/generateDishImageAction";
import { Sparkles } from "lucide-react";
import type { RecipeImageDTO } from "@/modules/image-generation/types";

interface DishImageSectionProps {
  recipeId: string;
  initialImage: RecipeImageDTO | null;
}

export function DishImageSection({
  recipeId,
  initialImage,
}: DishImageSectionProps) {
  const t = useTranslations("dishImage");
  const tErrors = useTranslations("errors");
  const [image, setImage] = useState<RecipeImageDTO | null>(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);
    const result = await generateDishImageAction(recipeId);
    if (result.success) {
      setImage(result.data);
    } else {
      setError(tErrors(result.error as Parameters<typeof tErrors>[0]));
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {t("title")}
      </h2>

      {isLoading && (
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
          <div className="aspect-square w-full animate-pulse bg-gradient-to-br from-orange-50 to-amber-50" />
          <div className="border-t border-zinc-100 px-5 py-3.5">
            <p className="text-center text-sm font-medium text-zinc-500">
              {t("loading")}
            </p>
          </div>
        </div>
      )}

      {!isLoading && image && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-md">
          <Image
            src={image.imageUrl}
            alt={t("alt")}
            width={1024}
            height={1024}
            className="w-full object-cover"
          />
        </div>
      )}

      {!isLoading && !image && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
            <Sparkles className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <p className="font-semibold text-zinc-800">{t("empty.title")}</p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-zinc-500">
              {t("empty.description")}
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-400 active:bg-orange-400 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            {t("empty.button")}
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}


