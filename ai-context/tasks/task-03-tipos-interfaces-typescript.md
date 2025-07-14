# Tarefa 3: Tipos e Interfaces TypeScript - Detalhamento de Atividades

## Contexto

Esta tarefa foca na organização e padronização dos tipos TypeScript já existentes no projeto, alinhando-os com os tipos gerados automaticamente pelo Prisma e garantindo consistência em toda a aplicação.

## Estado Atual do Codebase

- ✅ Schema Prisma completo com models Quiz, Step, Element, Response, Answer
- ✅ Tipos compostos básicos já criados em `/src/types/composed.ts`
- ✅ Tipos para API já estruturados em `/src/types/api.ts`
- ❌ Alguns tipos podem estar inconsistentes com o schema Prisma
- ❌ Falta padronização entre arquivos de tipos
- ❌ Tipos de analytics e user não são necessários para o MVP
- ❌ Falta tipos específicos para o editor e interface pública

## Atividades Detalhadas

### 3.1 Limpeza e Reorganização dos Tipos Existentes

**Problema identificado**: Arquivos de tipos contêm funcionalidades fora do escopo do MVP.

**Ações necessárias**:

- [ ] Remover tipos relacionados a usuários (`/src/types/user.ts`)
- [ ] Remover tipos relacionados a analytics (`/src/types/analytics.ts`)
- [ ] Manter apenas tipos essenciais para o MVP
- [ ] Verificar consistência com tipos gerados pelo Prisma

**Resultado esperado**: Apenas tipos relevantes para o MVP mantidos no projeto.

### 3.2 Padronização dos Tipos Compostos

**Ações necessárias**:

- [ ] Revisar e padronizar `/src/types/composed.ts`
- [ ] Garantir que todos os tipos compostos usem os tipos base do Prisma
- [ ] Adicionar tipos específicos para operações do editor
- [ ] Adicionar tipos para resposta pública dos quizzes

**Tipos compostos essenciais para o MVP**:

```typescript
// Tipos para operações do editor
export type QuizWithSteps = Quiz & {
  steps: (Step & { elements: Element[] })[];
};

export type StepWithElements = Step & {
  elements: Element[];
};

// Tipos para resposta completa
export type ResponseWithAnswers = Response & {
  answers: Answer[];
};

// Tipos para criação (sem campos auto-gerados)
export type CreateQuizInput = Omit<Quiz, "id" | "createdAt" | "updatedAt">;
export type CreateStepInput = Omit<Step, "id" | "quizId">;
export type CreateElementInput = Omit<Element, "id" | "stepId">;
```

### 3.3 Criação de Tipos para Conteúdo de Elementos

**Ações necessárias**:

- [ ] Definir tipos específicos para cada tipo de elemento
- [ ] Criar union types para conteúdo de elementos
- [ ] Garantir type safety para propriedades específicas de cada elemento

**Tipos necessários**:

```typescript
// Conteúdo específico para elemento de texto
export interface TextElementContent {
  text: string;
  fontSize?: "sm" | "base" | "lg" | "xl" | "2xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textAlign?: "left" | "center" | "right";
  color?: string;
}

// Conteúdo específico para múltipla escolha
export interface MultipleChoiceElementContent {
  question: string;
  options: {
    id: string;
    text: string;
    value: string;
  }[];
  required?: boolean;
  allowMultiple?: boolean;
}

// Conteúdo específico para botão de navegação
export interface NavigationButtonElementContent {
  text: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  action: "next" | "previous" | "submit";
}
```

### 3.4 Criação de Tipos para o Editor

**Ações necessárias**:

- [ ] Criar tipos específicos para operações do editor
- [ ] Definir tipos para propriedades de elementos no editor
- [ ] Criar tipos para estado do editor e preview

**Tipos necessários**:

```typescript
// Definição de elementos disponíveis no editor
export interface ElementDefinition {
  type: ElementType;
  label: string;
  icon: string;
  defaultContent: ElementContent;
  category: "content" | "input" | "navigation";
}

// Estado do editor
export interface EditorState {
  currentStepId: string | null;
  selectedElementId: string | null;
  isPreviewMode: boolean;
  unsavedChanges: boolean;
}

// Props para componentes do editor
export interface ElementEditorProps {
  element: Element;
  onUpdate: (elementId: string, content: ElementContent) => void;
  onDelete: (elementId: string) => void;
  isSelected: boolean;
}
```

### 3.5 Padronização dos Tipos de API

**Ações necessárias**:

- [ ] Revisar e padronizar `/src/types/api.ts`
- [ ] Remover tipos desnecessários para o MVP
- [ ] Garantir consistência com tipos compostos
- [ ] Adicionar tipos específicos para interface pública

**Verificações necessárias**:

- [ ] Tipos de request/response para criação de quiz
- [ ] Tipos para buscar quiz público
- [ ] Tipos para submissão de respostas
- [ ] Tipos de erro padronizados

### 3.6 Criação de Tipos para Interface Pública

**Ações necessárias**:

- [ ] Criar arquivo `/src/types/public.ts`
- [ ] Definir tipos específicos para a interface pública dos quizzes
- [ ] Criar tipos para coleta de respostas

**Tipos necessários**:

```typescript
// Dados do quiz para interface pública (sem dados sensíveis)
export interface PublicQuizData {
  id: string;
  title: string;
  description?: string;
  steps: PublicStepData[];
}

export interface PublicStepData {
  id: string;
  title: string;
  order: number;
  elements: PublicElementData[];
}

export interface PublicElementData {
  id: string;
  type: ElementType;
  order: number;
  content: ElementContent;
}

// Estados da interface pública
export interface QuizSessionState {
  currentStepIndex: number;
  responses: Record<string, unknown>;
  sessionId: string;
  startedAt: Date;
}

// Valores de resposta
export interface AnswerValue {
  text?: string;
  selectedOptions?: string[];
  multipleChoice?: string | string[];
}
```

### 3.7 Criação de Tipos para Validação

**Ações necessárias**:

- [ ] Criar arquivo `/src/types/validation.ts`
- [ ] Definir tipos para validação de formulários
- [ ] Criar tipos para erros de validação

**Tipos necessários**:

```typescript
// Validação de elementos
export interface ElementValidation {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  minOptions?: number;
  maxOptions?: number;
}

// Erros de validação
export interface ValidationError {
  elementId: string;
  message: string;
  code: string;
}

// Estado de validação
export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  touched: Record<string, boolean>;
}
```

### 3.8 Criação de Tipos para Props de Componentes

**Ações necessárias**:

- [ ] Criar arquivo `/src/types/components.ts`
- [ ] Definir tipos para props de componentes principais
- [ ] Garantir reutilização e consistência

**Tipos necessários**:

```typescript
// Props para componentes de elemento
export interface ElementComponentProps {
  element: Element;
  onChange?: (value: unknown) => void;
  value?: unknown;
  error?: string;
  disabled?: boolean;
}

// Props para componentes do editor
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
```

### 3.9 Verificação de Consistência com Prisma

**Ações necessárias**:

- [ ] Executar `npx prisma generate` para garantir tipos atualizados
- [ ] Verificar se todos os imports do `@prisma/client` estão corretos
- [ ] Testar compilação TypeScript sem erros
- [ ] Verificar se não há tipos duplicados ou conflitantes

## Critérios de Conclusão

A Tarefa 3 estará concluída quando:

- ✅ Apenas tipos relevantes para o MVP mantidos no projeto
- ✅ Todos os tipos consistentes com schema Prisma
- ✅ Tipos específicos para conteúdo de elementos criados
- ✅ Tipos para o editor e interface pública definidos
- ✅ Tipos para API padronizados e completos
- ✅ Props de componentes tipadas adequadamente
- ✅ Projeto compilando sem erros TypeScript
- ✅ Imports organizados e funcionando corretamente

## Dependências

**Pré-requisitos**:

- Tarefa 1: Configuração Inicial (concluída)
- Tarefa 2: Modelagem de Dados (concluída)

**Próximas tarefas que dependem desta**:

- Tarefa 4: Componentes Base UI
- Tarefa 5: Sistema de Elementos
- Tarefa 6: Editor/Criador de Quiz

## Observações Técnicas

1. **Prioridade MVP**: Manter apenas tipos essenciais para o funcionamento básico do sistema.

2. **Consistência com Prisma**: Sempre usar tipos base gerados pelo Prisma e criar tipos compostos quando necessário.

3. **Type Safety**: Garantir que conteúdo de elementos seja tipado corretamente para evitar erros em runtime.

4. **Reutilização**: Criar tipos que possam ser reutilizados em diferentes partes da aplicação.

5. **Organização**: Manter arquivos de tipos organizados por domínio/funcionalidade.

6. **Import Strategy**: Preferir imports nomeados e organizar por origem (Prisma, tipos locais, etc.).
