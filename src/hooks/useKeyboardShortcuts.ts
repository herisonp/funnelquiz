"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useEditorStore } from "./useEditorStore";
import { useQuizValidation } from "./useQuizValidation";
import { toast } from "sonner";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
  condition?: () => boolean;
}

export function useKeyboardShortcuts() {
  const {
    keyboardShortcutsEnabled,
    selectedElementId,
    isPreviewMode,
    togglePreviewMode,
    removeElement,
    hasUnsavedChanges,
    selectElement,
  } = useEditorStore();

  const { canPreview } = useQuizValidation();

  const shortcuts: KeyboardShortcut[] = useMemo(
    () => [
      {
        key: "s",
        ctrlKey: true,
        description: "Salvar quiz",
        action: () => {
          // Aqui será implementado o salvamento manual
          if (hasUnsavedChanges) {
            toast.success("Quiz salvo com sucesso!");
          } else {
            toast.info("Nenhuma alteração para salvar");
          }
        },
      },
      {
        key: "p",
        ctrlKey: true,
        description: "Alternar preview",
        action: () => {
          if (canPreview) {
            togglePreviewMode();
            toast.info(
              isPreviewMode ? "Modo edição ativado" : "Modo preview ativado"
            );
          } else {
            toast.error("Corrija os erros antes de visualizar o quiz");
          }
        },
      },
      {
        key: "Tab",
        description: "Alternar entre modo edição e preview",
        action: () => {
          if (canPreview) {
            togglePreviewMode();
            toast.info(
              isPreviewMode ? "Modo edição ativado" : "Modo preview ativado"
            );
          } else {
            toast.error("Corrija os erros antes de visualizar o quiz");
          }
        },
      },
      {
        key: "Delete",
        description: "Remover elemento selecionado",
        action: () => {
          if (selectedElementId && !isPreviewMode) {
            removeElement(selectedElementId);
            toast.success("Elemento removido");
          }
        },
        condition: () => selectedElementId !== null && !isPreviewMode,
      },
      {
        key: "Escape",
        description: "Desselecionar elemento",
        action: () => {
          if (selectedElementId) {
            selectElement(null);
          }
        },
        condition: () => selectedElementId !== null,
      },
      {
        key: "d",
        ctrlKey: true,
        description: "Duplicar elemento selecionado",
        action: () => {
          if (selectedElementId && !isPreviewMode) {
            // TODO: Implementar duplicação de elemento
            toast.info("Duplicação será implementada em breve");
          }
        },
        condition: () => selectedElementId !== null && !isPreviewMode,
      },
      {
        key: "z",
        ctrlKey: true,
        description: "Desfazer última ação",
        action: () => {
          // TODO: Implementar undo
          toast.info("Desfazer será implementado em breve");
        },
        condition: () => !isPreviewMode,
      },
    ],
    [
      hasUnsavedChanges,
      canPreview,
      togglePreviewMode,
      isPreviewMode,
      selectedElementId,
      removeElement,
      selectElement,
    ]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!keyboardShortcutsEnabled) return;

      // Ignorar se estiver digitando em um input
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const isCtrlKey = event.ctrlKey || event.metaKey;

        if (
          event.key === shortcut.key &&
          (!shortcut.ctrlKey || isCtrlKey) &&
          (!shortcut.shiftKey || event.shiftKey) &&
          (!shortcut.altKey || event.altKey) &&
          (!shortcut.condition || shortcut.condition())
        ) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          break;
        }
      }
    },
    [keyboardShortcutsEnabled, shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const getShortcutDisplay = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];

    if (shortcut.ctrlKey) {
      parts.push(navigator.platform.includes("Mac") ? "⌘" : "Ctrl");
    }
    if (shortcut.shiftKey) parts.push("Shift");
    if (shortcut.altKey) parts.push("Alt");

    parts.push(shortcut.key === " " ? "Space" : shortcut.key);

    return parts.join(" + ");
  };

  return {
    shortcuts: shortcuts.map((shortcut) => ({
      ...shortcut,
      display: getShortcutDisplay(shortcut),
    })),
    keyboardShortcutsEnabled,
  };
}
