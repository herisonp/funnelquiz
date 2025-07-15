"use client";

import React from "react";
import { Element } from "@prisma/client";
import { TextElementProperties } from "./properties/TextElementProperties";
import { MultipleChoiceElementProperties } from "./properties/MultipleChoiceElementProperties";
import { NavigationButtonElementProperties } from "./properties/NavigationButtonElementProperties";

interface ElementPropertiesProps {
  element: Element;
}

function ElementProperties({ element }: ElementPropertiesProps) {
  // Switch to appropriate properties panel based on element type
  switch (element.type) {
    case "TEXT":
      return <TextElementProperties element={element} />;

    case "MULTIPLE_CHOICE":
      return <MultipleChoiceElementProperties element={element} />;

    case "NAVIGATION_BUTTON":
      return <NavigationButtonElementProperties element={element} />;

    default:
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">
            Propriedades não disponíveis para este tipo de elemento:{" "}
            {element.type}
          </p>
        </div>
      );
  }
}

export default ElementProperties;
