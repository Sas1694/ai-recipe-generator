import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChefHat } from "lucide-react";
import { LegalContent } from "../components/LegalContent";

export default async function PrivacyPage() {
  const t = await getTranslations("legal");
  const tp = await getTranslations("legal.privacy");

  const sections = [
    { title: tp("s1Title"), content: tp("s1") },
    { title: tp("s2Title"), content: tp("s2") },
    { title: tp("s3Title"), content: tp("s3") },
    { title: tp("s4Title"), content: tp("s4") },
    { title: tp("s5Title"), content: tp("s5") },
    { title: tp("s6Title"), content: tp("s6") },
    { title: tp("s7Title"), content: tp("s7") },
    { title: tp("s8Title"), content: tp("s8") },
    { title: tp("s9Title"), content: tp("s9") },
    { title: tp("s10Title"), content: tp("s10") },
    { title: tp("s11Title"), content: tp("s11") },
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
          {tp("title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{tp("lastUpdated")}</p>

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
