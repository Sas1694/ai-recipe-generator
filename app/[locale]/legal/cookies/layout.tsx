import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export async function generateMetadata() {
  const t = await getTranslations("metadata");

  return {
    title: t("cookiesTitle"),
  };
}

export default function CookiesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
