"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { deleteAccountAction } from "@/modules/auth/actions/deleteAccountAction";

export function DeleteAccountSection() {
  const t = useTranslations("settings");
  const tErrors = useTranslations("errors");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const result = await deleteAccountAction();
    if (!result.success) {
      setError(result.error ?? "accountDeletionFailed");
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">
        {t("dangerZoneSection")}
      </h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-200">{t("deleteTitle")}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            {t("deleteDescription")}
          </p>
        </div>
        {!showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className="shrink-0 cursor-pointer rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 active:bg-red-500/20 active:text-red-300"
          >
            {t("deleteButton")}
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="text-sm font-semibold text-zinc-100">{t("confirmTitle")}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">
            {t("confirmDescription")}
          </p>
          {error && (
            <p className="mt-3 text-xs text-red-400">
              {tErrors(error as Parameters<typeof tErrors>[0])}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-500 active:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? t("deleting") : t("confirmButton")}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
              className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:text-zinc-200 active:text-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {t("cancelButton")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
