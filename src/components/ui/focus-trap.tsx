"use client";

import React, { useEffect, useRef } from "react";

interface FocusTrapProps {
  children: React.ReactNode;
  enabled?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
}

export function FocusTrap({
  children,
  enabled = true,
  restoreFocus = true,
  autoFocus = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Store the previously focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Focus the first focusable element if autoFocus is enabled
    if (autoFocus) {
      const firstFocusable = getFocusableElements(container)[0];
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(container);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus to the previously focused element
      if (restoreFocus && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [enabled, autoFocus, restoreFocus]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelector = [
    "button:not(:disabled)",
    "input:not(:disabled)",
    "textarea:not(:disabled)",
    "select:not(:disabled)",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])",
    "[contenteditable='true']",
  ].join(", ");

  return Array.from(container.querySelectorAll(focusableSelector)).filter(
    (element) => {
      const el = element as HTMLElement;
      return (
        el.offsetWidth > 0 &&
        el.offsetHeight > 0 &&
        getComputedStyle(el).visibility !== "hidden"
      );
    }
  ) as HTMLElement[];
}
