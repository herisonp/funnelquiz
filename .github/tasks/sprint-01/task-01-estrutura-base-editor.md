# Tarefa 01 - Estrutura Base do Editor

## Contexto

Implementar a interface principal do editor drag-and-drop para criação de quizzes, estabelecendo a fundação visual e funcional do produto. Esta é a primeira tarefa crítica do MVP que permitirá aos usuários acessar e navegar pela interface de criação de quizzes.

## Pré-requisitos

- Next.js App Router configurado
- Shadcn/ui components instalados
- Zustand store (`useEditorStore`) já estruturado
- Tailwind CSS configurado
- @dnd-kit instalado para funcionalidade drag-and-drop

## Atividades

### 1. Criar Layout Principal do Editor

**Descrição:** Implementar a estrutura de layout da página `/editor` com header, sidebar e canvas principal
**Arquivos afetados:**

- `src/app/editor/page.tsx` (criar)
- `src/app/editor/layout.tsx` (criar)
- `src/components/editor/EditorLayout.tsx` (criar)

**Critérios de aceite:**

- [ ] Página `/editor` renderiza sem erros
- [ ] Layout possui 3 áreas distintas: header, sidebar e canvas
- [ ] Design responsivo funciona em desktop (>1024px) e tablet (768px-1024px)
- [ ] Navegação por Next.js Link funciona corretamente

### 2. Implementar Header do Editor

**Descrição:** Criar componente de header com logo, título do quiz e ações principais
**Arquivos afetados:**

- `src/components/editor/EditorHeader.tsx` (criar)
- `src/components/ui/Button.tsx` (usar existente Shadcn)

**Critérios de aceite:**

- [ ] Header exibe título "Funnel Quiz Editor"
- [ ] Botão "Preview" navegando para `/quiz/preview`
- [ ] Botão "Reset" limpa o estado do editor via useEditorStore
- [ ] Header é fixo no topo e responsivo
- [ ] Utiliza componentes Shadcn/ui como base

### 3. Criar Sidebar de Elementos

**Descrição:** Implementar sidebar esquerda com lista de elementos disponíveis para drag-and-drop
**Arquivos afetados:**

- `src/components/editor/ElementsSidebar.tsx` (criar)
- `src/components/editor/DraggableElement.tsx` (criar)
- `src/lib/element-definitions.ts` (usar existente)

**Critérios de aceite:**

- [ ] Sidebar mostra elementos: TEXT, MULTIPLE_CHOICE, NAVIGATION_BUTTON
- [ ] Elementos são draggable usando @dnd-kit
- [ ] Sidebar é colapsável em telas menores
- [ ] Visual feedback durante drag operation
- [ ] Integração com element registry existente

### 4. Implementar Canvas de Edição

**Descrição:** Criar área principal onde elementos são organizados e editados
**Arquivos afetados:**

- `src/components/editor/EditorCanvas.tsx` (criar)
- `src/components/editor/DropZone.tsx` (criar)
- `src/hooks/useEditorStore.ts` (usar existente)

**Critérios de aceite:**

- [ ] Canvas aceita drop de elementos da sidebar
- [ ] Elementos droppados são adicionados ao useEditorStore
- [ ] Canvas mostra estado vazio com placeholder apropriado
- [ ] Drop zones são visualmente destacadas durante drag
- [ ] Elementos renderizados são clicáveis para seleção

### 5. Implementar Properties Panel

**Descrição:** Criar sidebar direita para edição de propriedades do elemento selecionado
**Arquivos afetados:**

- `src/components/editor/PropertiesPanel.tsx` (criar)
- `src/components/editor/ElementProperties.tsx` (criar)

**Critérios de aceite:**

- [ ] Panel aparece quando elemento é selecionado
- [ ] Mostra propriedades específicas do tipo de elemento
- [ ] Alterações atualizam o estado via useEditorStore
- [ ] Panel é responsivo e colapsável
- [ ] Feedback visual para elemento ativo/selecionado

### 6. Implementar Sistema de Steps Básico

**Descrição:** Adicionar navegação entre steps (etapas) do quiz no editor
**Arquivos afetados:**

- `src/components/editor/StepsNavigation.tsx` (criar)
- `src/components/editor/StepTab.tsx` (criar)

**Critérios de aceite:**

- [ ] Navegação horizontal de steps no header
- [ ] Indica step atual visualmente
- [ ] Permite criar novo step (máximo 5 para MVP)
- [ ] Permite deletar step (mínimo 1)
- [ ] Estado dos elementos preservado por step
- [ ] Integração com useEditorStore para currentStep

### 7. Configurar Roteamento e Navegação

**Descrição:** Estabelecer navegação entre editor e preview, preparar estrutura de rotas
**Arquivos afetados:**

- `src/app/editor/page.tsx` (modificar)
- `src/app/quiz/preview/page.tsx` (criar placeholder)
- `src/components/common/Navigation.tsx` (criar)

**Critérios de aceite:**

- [ ] Botão Preview direciona para `/quiz/preview`
- [ ] Dados do editor são passados via useEditorStore
- [ ] Navegação usa Next.js navigation (useRouter, Link)
- [ ] URLs são clean e funcionais
- [ ] Breadcrumb básico para orientação do usuário

## Validação

### Critérios de Aceite Geral

- [ ] Interface do editor renderiza corretamente em diferentes tamanhos de tela
- [ ] Layout responsivo funciona em desktop (>1024px) e tablet (768px-1024px)
- [ ] Navegação entre editor e preview é fluida
- [ ] Drag-and-drop básico funciona (arrastar elemento da sidebar para canvas)
- [ ] Estado é gerenciado corretamente via useEditorStore
- [ ] Todos os componentes usam Shadcn/ui como base
- [ ] Performance aceitável (renderização < 1s)

### Testes de Validação

1. **Layout Responsivo:** Testar em Chrome DevTools em resoluções 1920x1080, 1366x768, 768x1024
2. **Navegação:** Clicar em Preview e verificar se dados persistem via Zustand
3. **Drag-and-Drop:** Arrastar elemento TEXT da sidebar para canvas
4. **State Management:** Verificar se seleção de elemento atualiza properties panel
5. **Steps Navigation:** Criar/deletar steps e verificar persistência de elementos

## Observações Técnicas

### Padrões do Projeto Funnel Quiz

- **Shadcn/ui First:** Todos os componentes base devem usar Shadcn como fundação
- **Zustand Integration:** Utilizar `useEditorStore` para todo gerenciamento de estado
- **Element Registry:** Aproveitar sistema existente em `src/lib/element-definitions.ts`
- **Next.js App Router:** Usar componentes Server quando possível, Client apenas quando necessário
- **TypeScript Strict:** Manter tipagem forte, especialmente para element content

### Considerações de Performance

- Usar `React.memo` para componentes de elementos que re-renderizam frequentemente
- Implementar debounce em updates de propriedades
- Lazy loading para components pesados do editor

### Acessibilidade

- Keyboard navigation para drag-and-drop
- ARIA labels para elementos interativos
- Focus management apropriado
- Screen reader support básico

### Mobile Strategy

- Editor otimizado para tablet (768px+)
- Mobile redirect para interface simplificada (futuro)
- Touch-friendly drag-and-drop

## Próximos Passos

Após conclusão desta tarefa:

- Tarefa 02: Sistema de Elementos Básicos (depende do canvas funcional)
- Tarefa 03: Sistema de Steps avançado (expandir navegação básica)
- Integração com element-definitions.ts
