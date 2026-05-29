import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChefHat } from "lucide-react";
import { LegalContent } from "../components/LegalContent";

export default async function CookiesPage() {
  const t = await getTranslations("legal");
  const tc = await getTranslations("legal.cookies");

  const sections = [
    { title: tc("s1Title"), content: tc("s1") },
    { title: tc("s2Title"), content: tc("s2") },
    { title: tc("s3Title"), content: tc("s3") },
    { title: tc("s4Title"), content: tc("s4") },
    { title: tc("s5Title"), content: tc("s5") },
    { title: tc("s6Title"), content: tc("s6") },
    { title: tc("s7Title"), content: tc("s7") },
  ] as const;

  return (
    <main id="main-content" className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6">
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
          {tc("title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{tc("lastUpdated")}</p>

        <div className="mt-10 space-y-8">
          {sections.map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-base font-semibold text-zinc-200">{title}</h2>
              <div className="mt-2 text-sm leading-relaxed text-zinc-400">
                <LegalContent content={content} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
