"use client";

import EditorLayout from "@/components/editor/EditorLayout";
import { useEditorStore } from "@/hooks/useEditorStore";
import { useEffect } from "react";

export default function EditorPage() {
  const createNewQuiz = useEditorStore((state) => state.createNewQuiz);

  useEffect(() => {
    // Initialize with a new quiz if none exists
    createNewQuiz();
  }, [createNewQuiz]);

  return <EditorLayout />;
}
