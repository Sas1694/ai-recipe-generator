import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface RecipesPaginationProps {
  page: number;
  totalPages: number;
  query?: string;
  basePath: string;
}

export async function RecipesPagination({
  page,
  totalPages,
  query,
  basePath,
}: RecipesPaginationProps) {
  const t = await getTranslations("recipes.pagination");

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  }

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className="flex items-center justify-between gap-4">
      {isFirst ? (
        <span className="flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-300 select-none">
          <ChevronLeft className="h-4 w-4" />
          {t("prev")}
        </span>
      ) : (
        <Link
          href={buildHref(page - 1)}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-orange-200 hover:text-orange-600"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("prev")}
        </Link>
      )}

      <p className="text-xs text-zinc-400">
        {t("page", { current: page, total: totalPages })}
      </p>

      {isLast ? (
        <span className="flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-300 select-none">
          {t("next")}
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <Link
          href={buildHref(page + 1)}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-orange-200 hover:text-orange-600"
        >
          {t("next")}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
