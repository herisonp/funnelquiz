# Reordenação de Etapas por Drag and Drop

## Funcionalidade Implementada

Foi implementada a funcionalidade de reordenação de etapas através de drag and drop no painel lateral `StepsVerticalNavigation`. Agora os usuários podem clicar e arrastar verticalmente os botões de etapa para reorganizar a ordem das etapas no quiz.

## Como Funciona

### Interface do Usuário

- Cada botão de etapa agora possui um ícone de "pegador" (`GripVertical`) no lado esquerdo
- Ao passar o mouse sobre o ícone, ele fica mais visível (transição de opacidade)
- Durante o drag, o item fica com uma aparência semi-transparente e com sombra
- A reordenação acontece instantaneamente após soltar o item

### Implementação Técnica

#### 1. Hook `useEditorStore.ts`

- **Nova função:** `reorderSteps(stepIds: string[])`
  - Recebe um array com os IDs das etapas na nova ordem
  - Atualiza a propriedade `order` de cada etapa baseada no índice no array
  - Marca o quiz como modificado (`hasUnsavedChanges: true`)

#### 2. Componente `StepsVerticalNavigation.tsx`

- **Bibliotecas utilizadas:**

  - `@dnd-kit/core` - Context de drag and drop
  - `@dnd-kit/sortable` - Funcionalidade de lista sortable
  - `@dnd-kit/utilities` - Utilitários para transformações CSS

- **Componentes principais:**
  - `DndContext` - Context principal que gerencia o drag and drop
  - `SortableContext` - Context para listas sortables
  - `SortableStepItem` - Item individual sortable

#### 3. Estilos CSS (`drag-drop.css`)

- **Classes adicionadas:**
  - `.steps-sortable-item` - Transição suave durante o drag
  - `.steps-sortable-item.is-dragging` - Efeitos visuais durante o drag
  - `.steps-drag-handle` - Estilização do ícone de arraste

### Detalhes de Implementação

#### Sensores de Input

```typescript
const sensors = useSensors(
  useSensor(PointerSensor), // Mouse/touch
  useSensor(KeyboardSensor, {
    // Teclado (acessibilidade)
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

#### Handler de Drag End

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    const oldIndex = quiz.steps.findIndex((step) => step.id === active.id);
    const newIndex = quiz.steps.findIndex((step) => step.id === over.id);

    const reorderedSteps = arrayMove(quiz.steps, oldIndex, newIndex);
    const stepIds = reorderedSteps.map((step) => step.id);
    reorderSteps(stepIds);
  }
};
```

## Benefícios

1. **Experiência do Usuário**: Interface intuitiva para reorganizar etapas
2. **Performance**: Usa a biblioteca `@dnd-kit` que é otimizada para performance
3. **Acessibilidade**: Suporte a navegação por teclado
4. **Consistência**: Mantém a numeração das etapas atualizada automaticamente
5. **Persistência**: As mudanças são salvas automaticamente no estado da aplicação

## Limitações

- Máximo de 5 etapas (limite do MVP)
- Mínimo de 1 etapa (não é possível deletar a última etapa)
- A funcionalidade só está disponível em telas médias e grandes (`md:flex` - desktop)

## Compatibilidade

A funcionalidade é compatível com:

- ✅ Desktop (mouse)
- ✅ Touch devices (tablet/mobile)
- ✅ Teclado (acessibilidade)
- ✅ Todos os navegadores modernos

## Próximos Passos

Possíveis melhorias futuras:

1. Animação mais suave durante a reordenação
2. Preview da nova posição durante o drag
3. Desfazer/refazer para reordenação
4. Drag and drop entre diferentes quizzes
