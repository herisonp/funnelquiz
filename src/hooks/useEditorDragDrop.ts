"use client";

import {
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCallback, useState, useMemo } from "react";
import { useEditorStore } from "./useEditorStore";
import { ElementType } from "@prisma/client";

interface DragState {
  activeId: string | null;
  activeElement: Record<string, unknown> | null;
}

export function useEditorDragDrop() {
  const { quiz, currentStepId, addElement, moveElement } = useEditorStore();
  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    activeElement: null,
  });

  // Configurar sensors para mouse e touch com tolerância adequada
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Muito baixo para ativar facilmente
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50, // Delay mínimo para touch
        tolerance: 3,
      },
    })
  );

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const elements = useMemo(
    () => currentStep?.elements || [],
    [currentStep?.elements]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    setDragState({
      activeId: active.id.toString(),
      activeElement: active.data.current || null,
    });
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // Reset drag state
      setDragState({
        activeId: null,
        activeElement: null,
      });

      if (!over) {
        return;
      }

      try {
        const activeId = active.id.toString();
        const overId = over.id.toString();

        // Handle dropping from sidebar (new element)
        if (activeId.startsWith("element-")) {
          const elementType = active.data.current?.type as ElementType;

          if (elementType && currentStepId) {
            addElement(elementType);
          }
          return;
        }

        // Handle reordering existing elements
        const activeElement = elements.find((el) => el.id === activeId);
        const overElement = elements.find((el) => el.id === overId);

        if (activeElement && overElement && activeId !== overId) {
          const activeIndex = elements.findIndex((el) => el.id === activeId);
          const overIndex = elements.findIndex((el) => el.id === overId);

          if (activeIndex !== -1 && overIndex !== -1) {
            moveElement(activeId, overIndex);
          }
        }
      } catch (error) {
        console.error("Erro durante drag and drop:", error);
      }
    },
    [addElement, moveElement, currentStepId, elements]
  );

  const handleDragCancel = useCallback(() => {
    setDragState({
      activeId: null,
      activeElement: null,
    });
  }, []);

  return {
    sensors,
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    elements,
  };
}
