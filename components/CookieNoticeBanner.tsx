"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "cookie-notice-accepted";

export function CookieNoticeBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookieBanner");

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-zinc-900/95 px-4 py-4 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">
          {t("text")}{" "}
          <Link
            href="/legal/cookies"
            className="font-medium text-orange-400 underline underline-offset-2 transition-colors hover:text-orange-300"
          >
            {t("cookiePolicyLink")}
          </Link>
          .
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 cursor-pointer rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-400 active:bg-orange-400"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
