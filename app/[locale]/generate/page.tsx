import { GenerateContent } from "./components/GenerateContent";
import { auth } from "@/shared/auth/auth";
import { redirect } from "next/navigation";

export default async function GeneratePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <main id="main-content" className="flex flex-1 items-start justify-center px-4 py-10">
      <GenerateContent userId={session.user.id} />
    </main>
  );
}
