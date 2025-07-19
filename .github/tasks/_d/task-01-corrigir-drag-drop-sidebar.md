# Correção do Sistema Drag-and-Drop

## Contexto

O sistema de drag-and-drop atual entre a sidebar de elementos e o canvas de edição não está funcionando corretamente. Os usuários não conseguem arrastar elementos da sidebar para criar novos componentes no quiz, prejudicando a experiência principal do editor. Esta tarefa visa implementar um sistema robusto de drag-and-drop usando @dnd-kit, com feedback visual adequado e posicionamento correto dos elementos.

## Pré-requisitos

- Componente `EditorSidebar` existente em `src/components/editor/`
- Componente `EditorCanvas` existente em `src/components/editor/`
- Zustand store `useEditorStore` com métodos `addElement()` e `setCurrentStep()`
- Definições de elementos em `src/lib/element-definitions.ts`
- Biblioteca @dnd-kit já instalada no projeto

## Atividades

### 1. Configurar DndContext no EditorCanvas

**Descrição:** Implementar o contexto de drag-and-drop que envolve toda a área do editor
**Arquivos afetados:**

- `src/components/editor/EditorCanvas.tsx`
- `src/hooks/useEditorDragDrop.ts` (novo)

**Critérios de aceite:**

- [ ] DndContext configurado com collision detection otimizada
- [ ] Sensors para mouse e touch implementados
- [ ] Context envolve tanto sidebar quanto canvas
- [ ] Estado de dragging gerenciado adequadamente

### 2. Implementar Draggables na Sidebar

**Descrição:** Tornar os elementos da sidebar arrastáveis com feedback visual
**Arquivos afetados:**

- `src/components/editor/EditorSidebar.tsx`
- `src/components/editor/DraggableElement.tsx` (novo)

**Critérios de aceite:**

- [ ] Elementos da sidebar são draggáveis via useDraggable hook
- [ ] Feedback visual durante drag (opacity, cursor)
- [ ] Dados do tipo de elemento passados no drag
- [ ] Clone/ghost element aparece durante drag

### 3. Criar Drop Zone no Canvas

**Descrição:** Implementar área de drop funcional no canvas de edição
**Arquivos afetados:**

- `src/components/editor/EditorCanvas.tsx`
- `src/components/editor/CanvasDropZone.tsx` (novo)

**Critérios de aceite:**

- [ ] useDroppable hook configurado no canvas
- [ ] Drop zone visual aparece durante drag over
- [ ] Coordenadas de drop capturadas corretamente
- [ ] Estados de hover claramente indicados

### 4. Implementar Handler de Drop

**Descrição:** Processar o drop e criar novos elementos no quiz
**Arquivos afetados:**

- `src/hooks/useEditorDragDrop.ts`
- `src/components/editor/EditorCanvas.tsx`

**Critérios de aceite:**

- [ ] onDragEnd handler processa drops corretamente
- [ ] Novos elementos criados com IDs únicos
- [ ] Elementos adicionados ao step atual via Zustand
- [ ] Posicionamento baseado nas coordenadas de drop

### 5. Adicionar Feedback Visual Avançado

**Descrição:** Melhorar indicadores visuais durante operações de drag
**Arquivos afetados:**

- `src/components/editor/DragOverlay.tsx` (novo)
- `src/components/editor/DropIndicator.tsx` (novo)
- `src/styles/drag-drop.css` (novo)

**Critérios de aceite:**

- [ ] DragOverlay mostra preview do elemento sendo arrastado
- [ ] Indicadores de zona de drop visíveis e intuitivos
- [ ] Animações suaves e responsivas
- [ ] Estados de erro/sucesso claramente diferenciados

### 6. Implementar Drag Between Elements

**Descrição:** Permitir reordenação de elementos existentes no canvas
**Arquivos afetados:**

- `src/components/editor/SortableElement.tsx` (novo)
- `src/hooks/useEditorDragDrop.ts`

**Critérios de aceite:**

- [ ] Elementos existentes podem ser reordenados
- [ ] SortableContext configurado para lista de elementos
- [ ] Ordem persistida no Zustand store
- [ ] Animações de reordenação implementadas

### 7. Otimização e Tratamento de Erros

**Descrição:** Adicionar robustez e performance ao sistema de drag-drop
**Arquivos afetados:**

- `src/hooks/useEditorDragDrop.ts`
- `src/components/editor/EditorCanvas.tsx`

**Critérios de aceite:**

- [ ] Tratamento de drops inválidos
- [ ] Debounce para operações pesadas
- [ ] Cleanup de event listeners
- [ ] Performance otimizada para muitos elementos

## Validação

Para verificar se a tarefa foi concluída com sucesso:

1. **Teste de Drag-Drop Básico:**

   - Abrir o editor
   - Arrastar elemento "Text" da sidebar para o canvas
   - Verificar se elemento aparece corretamente posicionado

2. **Teste de Feedback Visual:**

   - Iniciar drag de qualquer elemento
   - Verificar indicadores visuais durante movimento
   - Confirmar animações suaves

3. **Teste de Reordenação:**

   - Criar múltiplos elementos no canvas
   - Arrastar para reordenar
   - Verificar nova ordem persistida

4. **Teste de Responsividade:**

   - Testar em diferentes resoluções (mobile, tablet, desktop)
   - Verificar funcionamento em touch devices
   - Confirmar performance adequada

5. **Teste de Estados de Erro:**
   - Tentar drops em áreas inválidas
   - Verificar tratamento de erros graceful

## Observações Técnicas

### Padrões do Funnel Quiz

- **Zustand Integration:** Usar `useEditorStore` para persistir mudanças
- **Element Definitions:** Referenciar tipos em `src/lib/element-definitions.ts`
- **Shadcn/ui:** Manter consistência visual com sistema de design
- **TypeScript:** Tipar adequadamente todos os handlers e data transfers

### Considerações de Performance

- Usar `useMemo` para collision detection algorithms
- Implementar throttling para drag events frequentes
- Otimizar re-renders com `React.memo` em componentes draggáveis

### Acessibilidade

- Adicionar ARIA labels para screen readers
- Implementar navegação por teclado como alternativa
- Manter focus management durante operações de drag

### Mobile/Touch Support

- Configurar touch sensors adequadamente
- Ajustar tempos de long-press para mobile
- Implementar haptic feedback onde possível

### Integração com Preview Mode

- Garantir que drag-drop só funciona em modo edição
- Preservar funcionalidade de preview sem interferência
- Manter separação clara entre
