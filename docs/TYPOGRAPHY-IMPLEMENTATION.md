# Sistema de Tipografia do Quiz

Este documento descreve como o sistema de tipografia funciona no FunnelQuiz.

## Funcionalidades Implementadas

### 1. Configuração de Fontes

O sistema permite configurar três aspectos principais da tipografia:

- **Fonte Principal**: Usada para todos os textos normais (parágrafos, botões, inputs)
- **Fonte dos Títulos**: Usada especificamente para títulos (h1, h2, h3) e textos grandes (xl, 2xl)
- **Tamanho Base da Fonte**: Tamanho padrão aplicado a todos os textos

### 2. Fontes Disponíveis

O sistema oferece uma seleção de fontes do Google Fonts:

#### Sans-Serif:

- Inter
- Roboto
- Open Sans
- Montserrat
- Poppins
- Nunito
- Source Sans Pro

#### Serif:

- Playfair Display
- Merriweather
- Lora
- Crimson Text
- Source Serif Pro

### 3. Tamanhos de Fonte

Opções de tamanho base disponíveis:

- Pequeno (14px)
- Médio (16px) - padrão
- Grande (18px)
- Extra Grande (20px)

## Implementação Técnica

### Arquivos Modificados/Criados

1. **src/types/composed.ts**

   - Adicionada interface `QuizFonts`
   - Constantes `GOOGLE_FONTS` e `FONT_SIZES`
   - Atualizado `QuizWithSteps` para incluir `fonts`

2. **src/hooks/useEditorStore.ts**

   - Adicionadas actions `updateQuizFonts` e `updateQuizFont`
   - Quiz padrão agora inclui configurações de fonte

3. **src/components/ui/font-picker.tsx**

   - Componente selector para escolher fontes
   - Usa shadcn Select component

4. **src/hooks/useGoogleFonts.ts**

   - `useGoogleFonts`: Carrega fontes do Google Fonts dinamicamente
   - `useQuizFontStyles`: Aplica estilos CSS em tempo real

5. **src/components/editor/PropertiesPanel.tsx**

   - Seção "Tipografia" no accordion do quiz
   - Três seletores para as configurações de fonte

6. **src/components/editor/EditorCanvas.tsx**

   - Integração dos hooks de fonte
   - Classe `quiz-canvas` para aplicação de estilos

7. **src/components/editor/QuizPreview.tsx**
   - Aplicação das fontes no modo preview

### Como Funciona

1. **Carregamento das Fontes**:

   - O hook `useGoogleFonts` injeta automaticamente um link para o Google Fonts no `<head>`
   - Carrega todas as fontes disponíveis para evitar flashes de texto

2. **Aplicação dos Estilos**:

   - O hook `useQuizFontStyles` cria dinamicamente uma tag `<style>` no DOM
   - Usa `!important` para garantir que as configurações do usuário sempre sejam aplicadas
   - Aplica as fontes através de CSS seletores na classe `.quiz-canvas`

3. **Hierarquia de Fontes**:

   ```css
   .quiz-canvas * {
     font-family: [fonte-principal] !important;
     font-size: [tamanho-base] !important;
   }

   .quiz-canvas h1,
   h2,
   h3,
   .text-xl,
   .text-2xl {
     font-family: [fonte-titulos] !important;
   }
   ```

4. **Tempo Real**:
   - As mudanças são aplicadas instantaneamente no canvas
   - Funciona tanto no modo editor quanto no preview

## Como Usar

1. **Acessar Configurações**:

   - No painel de propriedades, selecione a aba "Quiz"
   - Expanda a seção "Tipografia"

2. **Configurar Fontes**:

   - Escolha a fonte principal para textos gerais
   - Escolha a fonte para títulos
   - Selecione o tamanho base da fonte

3. **Visualizar Mudanças**:
   - As alterações são aplicadas em tempo real no canvas
   - Teste diferentes combinações para encontrar a melhor aparência

## Notas Técnicas

- As fontes são carregadas do Google Fonts, garantindo consistência cross-platform
- O sistema usa CSS custom properties e estilos inline para máxima compatibilidade
- Classes específicas evitam conflitos com estilos do editor
- O uso de `!important` garante que as configurações do usuário sempre prevaleçam

## Limitações Atuais

- Conjunto limitado de fontes (pode ser expandido facilmente)
- Apenas 4 opções de tamanho base
- Não há configuração de peso da fonte (bold, normal, etc.)

## Expansões Futuras

- Adicionar mais fontes do Google Fonts
- Configuração de peso e estilo da fonte
- Configuração de espaçamento entre linhas
- Configuração de espaçamento entre letras
- Preview das fontes no seletor
