import { Element, Step, ElementType } from "@prisma/client";
import {
  ElementDefinition,
  ElementContent,
  TextElementContent,
  MultipleChoiceElementContent,
  NavigationButtonElementContent,
} from "./composed";

// Props base para componentes de elemento
export interface ElementComponentProps {
  element: Element;
  onChange?: (value: unknown) => void;
  value?: unknown;
  error?: string;
  disabled?: boolean;
  isEditing?: boolean;
}

// Props para componentes específicos de elemento
export interface TextElementProps extends ElementComponentProps {
  content: TextElementContent;
}

export interface MultipleChoiceElementProps extends ElementComponentProps {
  content: MultipleChoiceElementContent;
}

export interface NavigationButtonElementProps extends ElementComponentProps {
  content: NavigationButtonElementContent;
}

// Props para componentes do editor
export interface ElementEditorProps {
  element: Element;
  onUpdate: (elementId: string, content: ElementContent) => void;
  onDelete: (elementId: string) => void;
  isSelected: boolean;
}

export interface EditorSidebarProps {
  availableElements: ElementDefinition[];
  onElementAdd: (type: ElementType) => void;
}

export interface StepNavigationProps {
  steps: Step[];
  currentStepId: string;
  onStepSelect: (stepId: string) => void;
  onStepAdd: () => void;
  onStepDelete: (stepId: string) => void;
}

// Props para canvas do editor (simplificado para MVP)
export interface EditorCanvasProps {
  currentStep: Step & { elements: Element[] };
  selectedElementId: string | null;
  onElementSelect: (elementId: string) => void;
  onElementUpdate: (elementId: string, content: ElementContent) => void;
  onElementDelete: (elementId: string) => void;
}

// Props para painel de propriedades
export interface PropertyPanelProps {
  selectedElement: Element | null;
  onElementUpdate: (elementId: string, content: ElementContent) => void;
}
