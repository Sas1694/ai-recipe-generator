import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("recipesTitle"),
    robots: { index: false, follow: false },
  };
}

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
