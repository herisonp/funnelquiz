# Validações e Melhorias de UX

## Contexto

Implementar validações básicas e melhorias de experiência do usuário para garantir que o editor e visualizador público sejam intuitivos e forneçam feedback adequado. Esta tarefa foca em polir a experiência do usuário através de validações, estados de loading e elementos de ajuda.

## Pré-requisitos

- Estrutura base do editor implementada (Tarefa 1)
- Sistema de elementos básicos funcionando (Tarefa 2)
- Sistema de steps implementado (Tarefa 3)
- Interface pública do quiz criada (Tarefa 4)
- Persistência local funcionando (Tarefa 5)
- Zustand store configurado e funcionando
- Componentes Shadcn/ui disponíveis

## Atividades

### 1. Sistema de Validação de Quiz

**Descrição:** Implementar validações para garantir que o quiz está completo antes do preview
**Arquivos afetados:**

- `src/lib/quiz-validator.ts` (novo)
- `src/hooks/useQuizValidation.ts` (novo)
- `src/stores/editor-store.ts` (modificar)
- `src/components/editor/EditorHeader.tsx` (modificar)

**Critérios de aceite:**

- [ ] Quiz deve ter pelo menos 1 step para ser válido
- [ ] Cada step deve ter pelo menos 1 elemento
- [ ] Steps com múltipla escolha devem ter pelo menos 2 opções
- [ ] Botão de preview só é habilitado com quiz válido
- [ ] Mensagens de erro específicas para cada tipo de validação
- [ ] Validação em tempo real durante edição

### 2. Estados de Loading e Feedback Visual

**Descrição:** Implementar loading states e feedback visual para todas as operações assíncronas
**Arquivos afetados:**

- `src/components/ui/loading-spinner.tsx` (novo)
- `src/components/ui/toast.tsx` (modificar - usar Shadcn toast)
- `src/stores/editor-store.ts` (modificar)
- `src/components/editor/ElementsSidebar.tsx` (modificar)
- `src/components/quiz/QuizRenderer.tsx` (modificar)

**Critérios de aceite:**

- [ ] Loading spinner durante salvamento automático
- [ ] Loading state ao carregar quiz do localStorage
- [ ] Feedback visual ao adicionar/remover elementos
- [ ] Toast notifications para ações importantes
- [ ] Skeleton loading para componentes pesados
- [ ] Estados de erro com opção de retry

### 3. Tooltips e Help Text

**Descrição:** Adicionar tooltips e textos de ajuda para guiar o usuário
**Arquivos afetados:**

- `src/components/ui/tooltip-help.tsx` (novo)
- `src/components/editor/ElementsSidebar.tsx` (modificar)
- `src/components/editor/PropertiesPanel.tsx` (modificar)
- `src/components/editor/StepsNavigation.tsx` (modificar)
- `src/components/editor/EditorCanvas.tsx` (modificar)

**Critérios de aceite:**

- [ ] Tooltip em todos os botões da sidebar
- [ ] Help text para propriedades de elementos
- [ ] Dicas contextuais no canvas vazio
- [ ] Explicação sobre limite de steps (5 máximo)
- [ ] Tooltips com atalhos de teclado
- [ ] Help text responsivo (mobile vs desktop)

### 4. Atalhos de Teclado Básicos

**Descrição:** Implementar atalhos de teclado para ações comuns no editor
**Arquivos afetados:**

- `src/hooks/useKeyboardShortcuts.ts` (novo)
- `src/components/editor/EditorLayout.tsx` (modificar)
- `src/stores/editor-store.ts` (modificar)

**Critérios de aceite:**

- [ ] Ctrl/Cmd + S para salvar manual
- [ ] Ctrl/Cmd + Z para desfazer (básico)
- [ ] Delete para remover elemento selecionado
- [ ] Ctrl/Cmd + D para duplicar elemento
- [ ] Esc para desselecionar elemento
- [ ] Ctrl/Cmd + P para preview
- [ ] Indicador visual de atalhos disponíveis

### 5. Melhorias de Acessibilidade

**Descrição:** Garantir que a interface seja acessível e siga padrões WCAG
**Arquivos afetados:**

- `src/components/editor/EditorCanvas.tsx` (modificar)
- `src/components/editor/ElementsSidebar.tsx` (modificar)
- `src/components/quiz/QuizRenderer.tsx` (modificar)
- `src/components/ui/focus-trap.tsx` (novo)

**Critérios de aceite:**

- [ ] Navegação por teclado funcional em todos os componentes
- [ ] Labels apropriados para screen readers
- [ ] Contraste adequado em todos os elementos
- [ ] Focus trap em modais e painéis
- [ ] Aria-labels descritivos
- [ ] Suporte para modo de alto contraste

### 6. Validação de Dados do Quiz Público

**Descrição:** Implementar validações para respostas do usuário final
**Arquivos afetados:**

- `src/lib/quiz-response-validator.ts` (novo)
- `src/components/quiz/MultipleChoiceElement.tsx` (modificar)
- `src/components/quiz/NavigationButton.tsx` (modificar)
- `src/stores/quiz-response-store.ts` (novo)

**Critérios de aceite:**

- [ ] Validação obrigatória para elementos marcados como required
- [ ] Feedback visual para campos inválidos
- [ ] Prevenção de avanço sem resposta obrigatória
- [ ] Mensagens de erro claras para usuário final
- [ ] Validação de formato (email, telefone, etc.)
- [ ] Estado de respostas persistido durante navegação

## Validação

### Critérios de Sucesso Gerais:

- [ ] Editor fornece feedback claro sobre estado do quiz
- [ ] Usuário consegue usar o editor sem documentação
- [ ] Loading states não causam confusão
- [ ] Interface é acessível via teclado
- [ ] Mensagens de erro são actionable
- [ ] Performance não é impactada negativamente

### Testes de Validação:

1. **Teste de Usabilidade:**

   - Usuário consegue criar quiz completo sem ajuda
   - Feedback visual é claro e útil
   - Atalhos funcionam conforme esperado

2. **Teste de Acessibilidade:**

   - Navegação apenas por teclado
   - Teste com screen reader
   - Verificação de contraste

3. **Teste de Error Handling:**
   - Cenários de erro são tratados graciosamente
   - Usuário consegue se recuperar de erros
   - Estados de loading não travam interface

## Observações Técnicas

### Padrões do Projeto:

- Usar Shadcn/ui para todos os componentes de feedback
- Manter consistência com design system existente
- Validações devem ser client-side para MVP
- Estados de loading devem ser não-blocantes quando possível

### Implementação Zustand:

```typescript
// Adicionar ao editor store
interface EditorState {
  // ...existing state...
  isValidating: boolean;
  validationErrors: ValidationError[];
  isLoading: boolean;
  keyboardShortcutsEnabled: boolean;
}
```

### Considerações de Performance:

- Debounce validações em tempo real (300ms)
- Lazy loading para tooltips pesados
- Memoização de validadores complexos
- Throttle para atalhos de teclado

### Integração com Arquitetura:

- Validações devem ser preparadas para backend futuro
- Estados de loading reutilizáveis para outras features
- Sistema de help deve ser extensível
- Atalhos devem considerar contexto (editor vs preview)
