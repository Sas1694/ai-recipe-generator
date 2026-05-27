import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CookieNoticeBanner } from "@/components/CookieNoticeBanner";

const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const ogLocale = ogLocaleMap[locale] ?? "en_US";
  const altLocale = locale === "en" ? "es_ES" : "en_US";

  return {
    title: {
      default: t("title"),
      template: `%s — ${t("siteName")}`,
    },
    description: t("description"),
    openGraph: {
      siteName: t("siteName"),
      type: "website",
      locale: ogLocale,
      alternateLocale: [altLocale],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "" });

  return (
    <NextIntlClientProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-orange-500 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
      >
        {t("skipNav")}
      </a>
      {children}
      <CookieNoticeBanner />
    </NextIntlClientProvider>
  );
}
