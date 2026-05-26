import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChefHat } from "lucide-react";

export default async function TermsPage() {
  const t = await getTranslations("legal");
  const tt = await getTranslations("legal.terms");

  const sections = [
    { title: tt("s1Title"), content: tt("s1") },
    { title: tt("s2Title"), content: tt("s2") },
    { title: tt("s3Title"), content: tt("s3") },
    { title: tt("s4Title"), content: tt("s4") },
    { title: tt("s5Title"), content: tt("s5") },
    { title: tt("s6Title"), content: tt("s6") },
    { title: tt("s7Title"), content: tt("s7") },
  ] as const;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15">
            <ChefHat className="h-4 w-4 text-orange-400" />
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {t("backLink")}
          </Link>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          {tt("title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{tt("lastUpdated")}</p>

        <div className="mt-10 space-y-8">
          {sections.map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-base font-semibold text-zinc-200">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
