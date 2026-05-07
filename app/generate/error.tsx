"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GenerateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Failed to process your request
        </h2>
        <p className="text-muted-foreground text-sm">
          Something went wrong while detecting ingredients or generating your
          recipe. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex justify-center gap-3">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/recipes">My recipes</Link>
          </Button>
        </div>
    </main>
  );
}
