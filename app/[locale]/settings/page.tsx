import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/shared/auth/auth";
import { getTranslations } from "next-intl/server";
import { ChefHat } from "lucide-react";
import { DeleteAccountSection } from "./components/DeleteAccountSection";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  const t = await getTranslations("settings");
  const { name, email } = session.user;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15">
            <ChefHat className="h-4 w-4 text-orange-400" />
          </div>
          <Link
            href="/generate"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {t("backButton")}
          </Link>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          {t("title")}
        </h1>

        <div className="mt-8 space-y-6">
          {/* Account Information */}
          <section className="rounded-2xl border border-white/8 bg-zinc-900 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              {t("accountSection")}
            </h2>
            <dl className="mt-4 space-y-3">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-zinc-500">{t("nameLabel")}</dt>
                <dd className="text-sm text-zinc-200">{name}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-zinc-500">{t("emailLabel")}</dt>
                <dd className="text-sm text-zinc-200">{email}</dd>
              </div>
            </dl>
          </section>

          <DeleteAccountSection />
        </div>
      </div>
    </main>
  );
}
