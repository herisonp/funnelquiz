"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ui/color-picker";
import FontPicker from "@/components/ui/font-picker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings, Layers, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import ElementProperties from "./ElementProperties";
import { cn } from "@/lib/utils";
import { GOOGLE_FONTS } from "@/types/composed";

export default function PropertiesPanel() {
  const {
    quiz,
    currentStepId,
    selectedElementId,
    updateStepTitle,
    updateQuizTitle,
    updateQuizDescription,
    updateQuizColor,
    updateQuizFont,
    propertiesTab,
    setPropertiesTab,
    selectElement,
  } = useEditorStore();
  const [stepTitle, setStepTitle] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const selectedElement = currentStep?.elements.find(
    (el) => el.id === selectedElementId
  );

  // Sincronizar o título local com o título da etapa atual
  useEffect(() => {
    if (currentStep?.title) {
      setStepTitle(currentStep.title);
    }
  }, [currentStep?.title]);

  // Sincronizar dados do quiz
  useEffect(() => {
    if (quiz?.title) {
      setQuizTitle(quiz.title);
    }
    if (quiz?.description) {
      setQuizDescription(quiz.description);
    }
  }, [quiz?.title, quiz?.description]);

  // Função para atualizar o título da etapa
  const handleStepTitleChange = (newTitle: string) => {
    setStepTitle(newTitle);
  };

  // Função para salvar o título quando o campo perde o foco
  const handleStepTitleBlur = () => {
    if (currentStep && stepTitle.trim() && stepTitle !== currentStep.title) {
      updateStepTitle(currentStep.id, stepTitle.trim());
    }
  };

  // Função para salvar o título quando pressionar Enter
  const handleStepTitleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur(); // Remove o foco do campo, acionando o handleStepTitleBlur
    }
  };

  // Funções para atualizar dados do quiz
  const handleQuizTitleChange = (newTitle: string) => {
    setQuizTitle(newTitle);
  };

  const handleQuizTitleBlur = () => {
    if (quiz && quizTitle.trim() && quizTitle !== quiz.title) {
      updateQuizTitle(quizTitle.trim());
    }
  };

  const handleQuizTitleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleQuizDescriptionChange = (newDescription: string) => {
    setQuizDescription(newDescription);
  };

  const handleQuizDescriptionBlur = () => {
    if (quiz && quizDescription.trim() !== quiz.description) {
      updateQuizDescription(quizDescription.trim());
    }
  };

  const handleQuizDescriptionKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  // Funções para lidar com os cliques nos tabs
  const handleStepTabClick = () => {
    if (selectedElementId) {
      selectElement(null);
    }
    setPropertiesTab("step");
  };

  const handleQuizTabClick = () => {
    if (selectedElementId) {
      selectElement(null);
    }
    setPropertiesTab("quiz");
  };

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-l z-40">
      <div className="flex flex-col h-full">
        {/* Header com Tabs */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Settings className="h-5 w-5 shrink-0" />
              <h2 className="font-semibold">Propriedades</h2>
            </div>
            {/* Navigation Tabs */}
            <div className="flex bg-muted rounded-md p-1">
              <Button
                variant={
                  !selectedElementId && propertiesTab === "step"
                    ? "default"
                    : "ghost"
                }
                size="sm"
                onClick={handleStepTabClick}
                className={cn(
                  "flex-1 h-8 text-xs flex items-center justify-center",
                  !selectedElementId && propertiesTab === "step"
                    ? "bg-black shadow-sm"
                    : "hover:bg-background/50"
                )}
              >
                <Layers className="h-3 w-3" />
              </Button>
              <Button
                variant={
                  !selectedElementId && propertiesTab === "quiz"
                    ? "default"
                    : "ghost"
                }
                size="sm"
                onClick={handleQuizTabClick}
                className={cn(
                  "flex-1 h-8 text-xs flex items-center justify-center",
                  !selectedElementId && propertiesTab === "quiz"
                    ? "bg-black shadow-sm"
                    : "hover:bg-background/50"
                )}
              >
                <FileText className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Content */}
        <ScrollArea className="flex-1 h-96">
          <div className="p-4">
            {selectedElement ? (
              <ElementProperties element={selectedElement} />
            ) : propertiesTab === "step" ? (
              <div className="space-y-6">
                {/* Step Information */}
                {currentStep && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">
                      Informações da Etapa
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Título
                        </label>
                        <Input
                          value={stepTitle}
                          onChange={(e) =>
                            handleStepTitleChange(e.target.value)
                          }
                          onBlur={handleStepTitleBlur}
                          onKeyPress={handleStepTitleKeyPress}
                          placeholder="Digite o título da etapa"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Elementos
                        </label>
                        <p className="text-sm font-medium">
                          {currentStep.elements.length} elemento(s)
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Ordem
                        </label>
                        <p className="text-sm font-medium">
                          Etapa {currentStep.order + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Quiz Information */}
                {quiz && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">
                      Informações do Quiz
                    </h3>
                    <Accordion
                      type="multiple"
                      defaultValue={["geral", "tipografia"]}
                      className="w-full"
                    >
                      {/* Grupo Geral */}
                      <AccordionItem value="geral">
                        <AccordionTrigger className="text-sm font-medium">
                          Geral
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-muted-foreground">
                                Título
                              </label>
                              <Input
                                value={quizTitle}
                                onChange={(e) =>
                                  handleQuizTitleChange(e.target.value)
                                }
                                onBlur={handleQuizTitleBlur}
                                onKeyPress={handleQuizTitleKeyPress}
                                placeholder="Digite o título do quiz"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">
                                Descrição
                              </label>
                              <Input
                                value={quizDescription}
                                onChange={(e) =>
                                  handleQuizDescriptionChange(e.target.value)
                                }
                                onBlur={handleQuizDescriptionBlur}
                                onKeyPress={handleQuizDescriptionKeyPress}
                                placeholder="Digite a descrição do quiz"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">
                                Total de Etapas
                              </label>
                              <p className="text-sm font-medium">
                                {quiz.steps.length} etapa(s)
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">
                                Status
                              </label>
                              <p className="text-sm font-medium">
                                {quiz.isPublished ? "Publicado" : "Rascunho"}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Grupo Header */}
                      <AccordionItem value="header">
                        <AccordionTrigger className="text-sm font-medium">
                          Header
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-sm text-muted-foreground">
                            Propriedades do header serão implementadas em breve.
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Grupo Cores */}
                      <AccordionItem value="cores">
                        <AccordionTrigger className="text-sm font-medium">
                          Cores
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <ColorPicker
                              label="Cor Primária"
                              value={quiz?.colors?.primaryColor || "#3b82f6"}
                              onChange={(color) =>
                                updateQuizColor("primaryColor", color)
                              }
                            />

                            <ColorPicker
                              label="Cor de Fundo"
                              value={quiz?.colors?.backgroundColor || "#ffffff"}
                              onChange={(color) =>
                                updateQuizColor("backgroundColor", color)
                              }
                            />

                            <ColorPicker
                              label="Cor dos Textos"
                              value={quiz?.colors?.textColor || "#374151"}
                              onChange={(color) =>
                                updateQuizColor("textColor", color)
                              }
                            />

                            <ColorPicker
                              label="Cor dos Títulos"
                              value={quiz?.colors?.titleColor || "#111827"}
                              onChange={(color) =>
                                updateQuizColor("titleColor", color)
                              }
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Grupo Tipografia */}
                      <AccordionItem value="tipografia">
                        <AccordionTrigger className="text-sm font-medium">
                          Tipografia
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <FontPicker
                              label="Fonte Principal"
                              value={
                                quiz?.fonts?.primaryFont || "Inter, sans-serif"
                              }
                              onChange={(font) =>
                                updateQuizFont("primaryFont", font)
                              }
                              options={[
                                ...GOOGLE_FONTS.SANS_SERIF,
                                ...GOOGLE_FONTS.SERIF,
                              ]}
                            />

                            <FontPicker
                              label="Fonte dos Títulos"
                              value={
                                quiz?.fonts?.headingFont || "Inter, sans-serif"
                              }
                              onChange={(font) =>
                                updateQuizFont("headingFont", font)
                              }
                              options={[
                                ...GOOGLE_FONTS.SANS_SERIF,
                                ...GOOGLE_FONTS.SERIF,
                              ]}
                            />
                            <p className="text-xs text-muted-foreground">
                              Aplica-se a títulos e textos Extra Grande e Extra
                              Extra Grande
                            </p>

                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Tamanho Base da Fonte
                              </label>
                              <div className="flex items-center space-x-2 mt-2">
                                <Input
                                  type="number"
                                  min="10"
                                  max="30"
                                  value={parseInt(
                                    quiz?.fonts?.baseFontSize?.replace(
                                      "px",
                                      ""
                                    ) || "16"
                                  )}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 10 && value <= 30) {
                                      updateQuizFont(
                                        "baseFontSize",
                                        `${value}px`
                                      );
                                    }
                                  }}
                                  className="w-20"
                                />
                                <span className="text-sm text-muted-foreground">
                                  px
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Define o tamanho padrão para textos normais
                                (10-30px)
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
