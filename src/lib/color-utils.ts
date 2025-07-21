/**
 * Utilitários para trabalhar com cores
 */

/**
 * Valida se uma string é uma cor hex válida
 * @param color - Cor no formato hex
 * @returns true se for válida, false caso contrário
 */
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  return hexRegex.test(color);
};

/**
 * Normaliza uma cor hex para o formato completo #RRGGBB
 * @param color - Cor no formato hex
 * @returns Cor normalizada
 */
export const normalizeHexColor = (color: string): string => {
  if (!color.startsWith("#")) {
    color = "#" + color;
  }

  // Se for formato #RGB, expandir para #RRGGBB
  if (color.length === 4) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    color = `#${r}${r}${g}${g}${b}${b}`;
  }

  return color.toUpperCase();
};

/**
 * Converte cor hex para RGB
 * @param hex - Cor no formato hex
 * @returns Objeto com valores r, g, b
 */
export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  const normalized = normalizeHexColor(hex);
  if (!isValidHexColor(normalized)) {
    return null;
  }

  const result = /^#([A-Fa-f\d]{2})([A-Fa-f\d]{2})([A-Fa-f\d]{2})$/.exec(
    normalized
  );
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Calcula o brilho de uma cor (luminance)
 * @param hex - Cor no formato hex
 * @returns Valor de luminance entre 0 e 1
 */
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  // Converter para sRGB
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  // Aplicar correção gamma
  const sR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const sG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const sB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calcular luminance
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
};

/**
 * Calcula a razão de contraste entre duas cores
 * @param color1 - Primeira cor em hex
 * @param color2 - Segunda cor em hex
 * @returns Razão de contraste (1-21)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Verifica se duas cores têm contraste adequado para acessibilidade
 * @param foreground - Cor de primeiro plano
 * @param background - Cor de fundo
 * @param level - Nível de conformidade WCAG ('AA' ou 'AAA')
 * @returns true se o contraste for adequado
 */
export const hasGoodContrast = (
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA"
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  const minRatio = level === "AAA" ? 7 : 4.5;
  return ratio >= minRatio;
};

/**
 * Gera uma cor de contraste adequada (branca ou preta) para uma cor de fundo
 * @param backgroundColor - Cor de fundo
 * @returns '#ffffff' ou '#000000'
 */
export const getContrastColor = (backgroundColor: string): string => {
  const whiteContrast = getContrastRatio(backgroundColor, "#ffffff");
  const blackContrast = getContrastRatio(backgroundColor, "#000000");

  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
};

/**
 * Valida uma cor e retorna uma cor padrão se inválida
 * @param color - Cor para validar
 * @param fallback - Cor padrão em caso de erro
 * @returns Cor válida
 */
export const validateColor = (color: string, fallback: string): string => {
  if (isValidHexColor(color)) {
    return normalizeHexColor(color);
  }
  return fallback;
};

/**
 * Cores padrão para o sistema
 */
export const DEFAULT_COLORS = {
  primary: "#3b82f6", // blue-500
  background: "#ffffff", // white
  text: "#374151", // gray-700
  title: "#111827", // gray-900
} as const;
