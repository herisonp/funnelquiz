# Sistema de Steps (Etapas) - Tarefa 3

## Contexto

Implementar o sistema de gerenciamento de múltiplas etapas (steps) dentro do quiz, permitindo que criadores organizem o conteúdo em sequências lógicas. Este sistema é fundamental para a criação de funnels de conversão efetivos, onde cada step coleta informações específicas do usuário.

## Pré-requisitos

- Interface base do editor implementada (Tarefa 1)
- Sistema de elementos básicos funcionando (Tarefa 2)
- Zustand store (`useEditorStore`) configurado
- Componentes Shadcn/ui disponíveis
- Tipos `QuizWithSteps` e `StepWithElements` definidos

## Atividades

### 1. Navegação entre Steps no Editor

**Descrição:** Implementar interface de tabs/navegação para alternar entre steps no editor
**Arquivos afetados:**

- `src/components/editor/step-navigation.tsx` (novo)
- `src/components/editor/editor-layout.tsx` (modificação)
- `src/store/editor-store.ts` (modificação)

**Critérios de aceite:**

- [ ] Tabs horizontais mostram todos os steps com numeração
- [ ] Step ativo é visualmente destacado
- [ ] Clique na tab alterna para o step correspondente
- [ ] Responsivo para até 5 steps em mobile
- [ ] Animação suave de transição entre steps

### 2. Controles de Gerenciamento de Steps

**Descrição:** Adicionar botões para criar, duplicar e deletar steps
**Arquivos afetados:**

- `src/components/editor/step-controls.tsx` (novo)
- `src/components/editor/step-navigation.tsx` (modificação)
- `src/store/editor-store.ts` (modificação)

**Critérios de aceite:**

- [ ] Botão "+" para adicionar novo step após o atual
- [ ] Botão de deletar step (mínimo de 1 step sempre)
- [ ] Confirmação antes de deletar step com elementos
- [ ] Reordenação via drag-and-drop das tabs
- [ ] Limite máximo de 5 steps para MVP

### 3. Preservação de Estado por Step

**Descrição:** Garantir que elementos e configurações sejam mantidos ao navegar entre steps
**Arquivos afetados:**

- `src/store/editor-store.ts` (modificação)
- `src/hooks/use-editor-persistence.ts` (novo)
- `src/components/editor/canvas.tsx` (modificação)

**Critérios de aceite:**

- [ ] Elementos permanecem no step correto ao navegar
- [ ] Elemento selecionado é limpo ao trocar de step
- [ ] Undo/redo funciona por step individual
- [ ] Auto-save preserva estado de todos os steps
- [ ] Performance otimizada para renderização conditional

### 4. Indicadores Visuais de Step

**Descrição:** Implementar feedback visual do status e progresso dos steps
**Arquivos afetados:**

- `src/components/editor/step-indicator.tsx` (novo)
- `src/components/editor/step-navigation.tsx` (modificação)
- `src/lib/step-validation.ts` (novo)

**Critérios de aceite:**

- [ ] Indicador de step vazio vs. com conteúdo
- [ ] Badge com contagem de elementos por step
- [ ] Ícone de warning para steps sem navegação
- [ ] Tooltip com resumo do conteúdo do step
- [ ] Status de validação (válido/inválido/incompleto)

### 5. Templates e Estruturas de Step

**Descrição:** Fornecer templates pré-definidos para tipos comuns de steps
**Arquivos afetados:**

- `src/lib/step-templates.ts` (novo)
- `src/components/editor/step-template-selector.tsx` (novo)
- `src/components/editor/step-controls.tsx` (modificação)

**Critérios de aceite:**

- [ ] Template "Introdução" (texto + botão continuar)
- [ ] Template "Pergunta" (título + múltipla escolha + navegação)
- [ ] Template "Captura de Lead" (formulário + botão enviar)
- [ ] Template "Agradecimento" (texto final + ações)
- [ ] Modal de seleção ao criar novo step

### 6. Integração com Preview

**Descrição:** Garantir que o sistema de steps funcione na visualização pública
**Arquivos afetados:**

- `src/components/quiz/quiz-renderer.tsx` (modificação)
- `src/components/quiz/step-progress.tsx` (novo)
- `src/hooks/use-quiz-navigation.ts` (modificação)

**Critérios de aceite:**

- [ ] Renderização sequencial dos steps no preview
- [ ] Barra de progresso visual entre steps
- [ ] Navegação "voltar" para steps anteriores
- [ ] Validação antes de avançar para próximo step
- [ ] URLs únicas por step (opcional para MVP)

## Validação

### Critérios de Aceite Gerais

- [ ] Usuário pode criar até 5 steps no quiz
- [ ] Navegação entre steps é fluida e intuitiva
- [ ] Estado dos elementos é preservado por step
- [ ] Deletar step requer confirmação
- [ ] Performance mantida com múltiplos steps
- [ ] Interface responsiva em mobile/tablet
- [ ] Preview reflete corretamente a estrutura de steps

### Testes de Aceitação

1. **Fluxo Básico:**

   - Criar novo quiz → adicionar 3 steps → adicionar elementos em cada → navegar entre eles → verificar persistência

2. **Fluxo de Edição:**

   - Deletar step do meio → verificar reordenação → duplicar step → verificar conteúdo copiado

3. **Fluxo de Preview:**
   - Alternar para preview → navegar sequencialmente → voltar ao editor → verificar estado preservado

## Observações Técnicas

### Padrões do Projeto

- Usar Zustand store para estado global dos steps
- Seguir padrão de componentes Shadcn/ui (Tabs, Button, etc.)
- Implementar validação com feedback visual consistente
- Manter tipagem forte com interfaces `Step` e `StepWithElements`

### Considerações de Performance

- Renderização condicional: apenas step atual renderizado no canvas
- Lazy loading de elementos em steps não ativos
- Otimização de re-renders com React.memo nos componentes de step
- Debounce para auto-save durante navegação rápida

### Integração com Sistema Existente

- Aproveitar `element-definitions.ts` para renderização de elementos
- Usar `useEditorStore` actions existentes (`setCurrentStep`, `addElement`, etc.)
- Manter compatibilidade com estrutura de dados Prisma
- Preparar para futura persistência via API

### UX/UI Guidelines

- Steps numerados começando em 1 (não 0)
- Cores consistent com design system do projeto
- Animações sutis para transições (< 200ms)
- Feedback imediato para ações do usuário
- Acessibilidade com navegação por teclado (Tab, Enter, Escape)
