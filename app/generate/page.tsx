import { AppHeader } from "@/components/AppHeader";
import { GenerateContent } from "./components/GenerateContent";

export default function GeneratePage() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <GenerateContent />
      </main>
    </>
  );
}
