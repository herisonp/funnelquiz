"use client";

import { useEffect } from "react";
import { GOOGLE_FONTS, QuizWithSteps } from "@/types/composed";

// Extrair nomes das fontes dos valores CSS
const extractFontName = (fontValue: string): string => {
  return fontValue.split(",")[0].replace(/"/g, "").trim();
};

// Obter todas as fontes únicas
const getAllFonts = (): string[] => {
  const allFonts = [
    ...GOOGLE_FONTS.SANS_SERIF.map((font) => extractFontName(font.value)),
    ...GOOGLE_FONTS.SERIF.map((font) => extractFontName(font.value)),
  ];
  return [...new Set(allFonts)];
};

// Hook para carregar fontes do Google Fonts
export const useGoogleFonts = (quiz?: QuizWithSteps | null) => {
  useEffect(() => {
    // Se temos um quiz, carregamos apenas as fontes ativas
    const fontsToLoad = quiz?.fonts
      ? [
          extractFontName(quiz.fonts.primaryFont),
          extractFontName(quiz.fonts.headingFont),
        ].filter((font, index, arr) => arr.indexOf(font) === index) // Remove duplicatas
      : getAllFonts();

    // Criar URL do Google Fonts
    const fontQuery = fontsToLoad
      .map((font) => font.replace(/\s+/g, "+"))
      .join("&family=");

    const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;

    // Verificar se o link já existe
    const existingLink = document.querySelector(
      `link[href*="fonts.googleapis.com"]`
    );

    if (!existingLink) {
      // Criar e adicionar o link para as fontes
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = "https://fonts.googleapis.com";
      document.head.appendChild(link);

      const link2 = document.createElement("link");
      link2.rel = "preconnect";
      link2.href = "https://fonts.gstatic.com";
      link2.crossOrigin = "anonymous";
      document.head.appendChild(link2);

      const fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href = googleFontsUrl;
      fontLink.id = "google-fonts-link";
      document.head.appendChild(fontLink);
    } else {
      // Atualizar o link existente se necessário
      const fontLink = document.getElementById(
        "google-fonts-link"
      ) as HTMLLinkElement;
      if (fontLink && fontLink.href !== googleFontsUrl) {
        fontLink.href = googleFontsUrl;
      }
    }
  }, [quiz?.fonts]);
};

// Hook para aplicar estilos CSS dinâmicos baseados nas configurações do quiz
export const useQuizFontStyles = (quiz: QuizWithSteps | null) => {
  useEffect(() => {
    if (!quiz?.fonts) return;

    const { primaryFont, headingFont, baseFontSize } = quiz.fonts;

    // Remover estilos anteriores se existirem
    const existingStyle = document.getElementById("quiz-font-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Criar novos estilos CSS
    const style = document.createElement("style");
    style.id = "quiz-font-styles";
    style.textContent = `
      /* Aplicar fonte principal para todos os textos */
      .quiz-canvas * {
        font-family: ${primaryFont} !important;
      }

      /* Aplicar tamanho base apenas para elementos com text-base */
      .quiz-canvas .text-base {
        font-size: ${baseFontSize} !important;
      }

      /* Aplicar fonte de título para headings e textos grandes */
      .quiz-canvas h1,
      .quiz-canvas h2,
      .quiz-canvas h3,
      .quiz-canvas .quiz-title,
      .quiz-canvas .step-title {
        font-family: ${headingFont} !important;
      }

      /* Aplicar fonte de título para textos xl e 2xl com maior especificidade */
      .quiz-canvas .text-xl,
      .quiz-canvas .text-2xl,
      .quiz-canvas .prose .text-xl,
      .quiz-canvas .prose .text-2xl,
      .quiz-canvas .text-xl p,
      .quiz-canvas .text-2xl p,
      .quiz-canvas .quiz-heading-text,
      .quiz-canvas .quiz-heading-text p {
        font-family: ${headingFont} !important;
      }

      /* Manter tamanhos específicos para headings */
      .quiz-canvas h1 {
        font-size: calc(${baseFontSize} * 2) !important;
      }

      .quiz-canvas h2 {
        font-size: calc(${baseFontSize} * 1.5) !important;
      }

      .quiz-canvas h3 {
        font-size: calc(${baseFontSize} * 1.25) !important;
      }

      /* Aplicar fonte nos botões */
      .quiz-canvas button {
        font-family: ${primaryFont} !important;
      }

      /* Aplicar fonte nos inputs */
      .quiz-canvas input,
      .quiz-canvas textarea,
      .quiz-canvas select {
        font-family: ${primaryFont} !important;
        font-size: ${baseFontSize} !important;
      }
    `;

    document.head.appendChild(style);

    // Cleanup na desmontagem
    return () => {
      const styleToRemove = document.getElementById("quiz-font-styles");
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [quiz?.fonts]);
};
