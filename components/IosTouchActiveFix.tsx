"use client";

import { useEffect } from "react";

/**
 * iOS Safari does not trigger the CSS :active pseudo-class on non-form elements
 * (links, divs, etc.) unless there is at least one touchstart listener registered
 * on the document. This component adds that empty listener, which is the standard
 * fix to enable active: Tailwind classes on all elements on iOS.
 */
export function IosTouchActiveFix() {
  useEffect(() => {
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  return null;
}

function noop() {}
