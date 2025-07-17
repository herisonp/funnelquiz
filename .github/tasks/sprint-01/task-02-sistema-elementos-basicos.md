# Sistema de Elementos Básicos

## Contexto

Implementar os 3 elementos essenciais do MVP: TextElement (para títulos e descrições), MultipleChoiceElement (para coletar respostas) e NavigationButtonElement (para fluxo entre steps). Estes elementos formam a base para criação de quizzes de conversão efetivos.

## Pré-requisitos

- Estrutura base do editor implementada (Tarefa 1)
- Zustand store configurado (`useEditorStore`)
- Sistema de drag-and-drop funcional com @dnd-kit
- Shadcn/ui components instalados e configurados
- Element definitions registry (`src/lib/element-definitions.ts`)

## Atividades

### 1. Definir Interfaces TypeScript para Element Content

**Descrição:** Criar tipos específicos para cada elemento no sistema polimorfo
**Arquivos afetados:**

- `src/types/composed.ts`

**Critérios de aceite:**

- [ ] Interface `TextElementContent` com propriedades: text, fontSize, textAlign, color
- [ ] Interface `MultipleChoiceElementContent` com options array, allowMultiple, required
- [ ] Interface `NavigationButtonElementContent` com label, targetStep, variant
- [ ] Type guards implementados para cada tipo de content
- [ ] Discriminated union atualizada para os 3 tipos

### 2. Implementar TextElement Component

**Descrição:** Componente para exibição e edição de texto (títulos, descrições, labels)
**Arquivos afetados:**

- `src/components/editor/elements/TextElement.tsx`
- `src/components/quiz/elements/TextElement.tsx`

**Critérios de aceite:**

- [ ] Renderização de texto com fontSize configurável (sm, base, lg, xl, 2xl)
- [ ] Edição inline no modo editor (contentEditable ou input)
- [ ] Suporte a textAlign (left, center, right)
- [ ] Aplicação de cores via Tailwind classes
- [ ] Auto-update no Zustand store via updateElement
- [ ] Versão read-only para interface pública do quiz

### 3. Implementar MultipleChoiceElement Component

**Descrição:** Componente para coleta de respostas com opções predefinidas
**Arquivos afetados:**

- `src/components/editor/elements/MultipleChoiceElement.tsx`
- `src/components/quiz/elements/MultipleChoiceElement.tsx`

**Critérios de aceite:**

- [ ] Lista dinâmica de opções (adicionar/remover/reordenar)
- [ ] Suporte a seleção única e múltipla (radio vs checkbox)
- [ ] Validação de campo obrigatório
- [ ] Estado visual para opção selecionada
- [ ] Callback para onAnswer na interface pública
- [ ] Máximo de 6 opções por elemento (limitação MVP)

### 4. Implementar NavigationButtonElement Component

**Descrição:** Botão para navegação entre steps do quiz
**Arquivos afetados:**

- `src/components/editor/elements/NavigationButtonElement.tsx`
- `src/components/quiz/elements/NavigationButtonElement.tsx`

**Critérios de aceite:**

- [ ] Variants de botão: primary, secondary, outline
- [ ] Configuração de targetStep (próximo, anterior, específico)
- [ ] Label editável
- [ ] Integração com sistema de navegação do quiz
- [ ] Validação de step de destino válido
- [ ] Disabled state quando navegação não disponível

### 5. Atualizar Element Registry System

**Descrição:** Registrar novos elementos no sistema de definições
**Arquivos afetados:**

- `src/lib/element-definitions.ts`

**Critérios de aceite:**

- [ ] Definições dos 3 elementos adicionadas ao registry
- [ ] Configuração de ícones para sidebar (Text, CheckSquare, ArrowRight)
- [ ] Propriedades padrão definidas para cada tipo
- [ ] Factory functions para criação de elementos
- [ ] Validação de content schema para cada tipo

### 6. Implementar Properties Panel Components

**Descrição:** Painéis de propriedades específicos para cada elemento
**Arquivos afetados:**

- `src/components/editor/properties/TextElementProperties.tsx`
- `src/components/editor/properties/MultipleChoiceElementProperties.tsx`
- `src/components/editor/properties/NavigationButtonElementProperties.tsx`
- `src/components/editor/properties/PropertiesPanel.tsx`

**Critérios de aceite:**

- [ ] Formulários específicos para cada tipo de elemento
- [ ] Controles para todas as propriedades configuráveis
- [ ] Auto-save de alterações no Zustand store
- [ ] Validação em tempo real dos valores
- [ ] Switch dinâmico baseado no elemento selecionado
- [ ] Preview em tempo real das alterações

### 7. Integrar Elementos com Drag and Drop

**Descrição:** Conectar elementos ao sistema de arrastar e soltar do editor
**Arquivos afetados:**

- `src/components/editor/ElementsSidebar.tsx`
- `src/components/editor/CanvasArea.tsx`

**Critérios de aceite:**

- [ ] Elementos disponíveis na sidebar para drag
- [ ] Drop zones funcionais no canvas
- [ ] Criação automática de elemento ao fazer drop
- [ ] Feedback visual durante drag operation
- [ ] Posicionamento correto dos elementos no step
- [ ] Seleção automática após drop para edição

### 8. Implementar Element Renderer Universal

**Descrição:** Sistema universal de renderização para editor e quiz público
**Arquivos afetados:**

- `src/components/common/ElementRenderer.tsx`

**Critérios de aceite:**

- [ ] Switch component baseado em element.type
- [ ] Modo editor vs quiz diferenciado via props
- [ ] Type safety com discriminated unions
- [ ] Error boundaries para elementos inválidos
- [ ] Fallback para tipos não reconhecidos
- [ ] Preservação de props específicas de cada contexto

## Validação

Para verificar se a tarefa foi concluída com sucesso:

1. **Teste de Criação:** Arrastar cada um dos 3 elementos para o canvas
2. **Teste de Edição:** Modificar propriedades via properties panel e verificar update visual
3. **Teste de Persistência:** Alterações mantidas no Zustand store entre navegação
4. **Teste de Preview:** Elementos renderizam corretamente na interface pública
5. **Teste de Responsividade:** Componentes funcionais em mobile/desktop
6. **Teste de TypeScript:** Compilação sem erros de tipo

## Observações Técnicas

### Padrões Específicos do Funnel Quiz:

- **Element Content Polimorfo:** Usar interfaces específicas em `composed.ts` com type guards
- **Zustand Integration:** Métodos `updateElement()` e `selectElement()` do store
- **Shadcn Base:** Todos os form controls devem usar componentes Shadcn (Input, Select, Switch)
- **Mobile-First:** Elementos devem ser otimizados para touch em dispositivos móveis
- **Conversion Focus:** Design oriented para maximizar engagement e conversão

### Considerações de Performance:

- **React.memo** para elementos que re-renderizam frequentemente
- **Lazy loading** para properties panels não utilizados
- **Debounced updates** para edição inline de texto
- **Virtualization** não necessária no MVP (máximo 10 elementos por step)

### Limitações do MVP:

- Máximo de 6 opções por MultipleChoice
- 3 tipos de elemento apenas
- Sem rich text editing (plain text)
- Sem upload de imagens/mídia
- Validação básica apenas (required fields)
