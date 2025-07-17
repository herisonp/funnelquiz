# Refatoração da Interface de Preview

## Contexto

Transformar o preview atual em uma visualização mais limpa e elegante do quiz, mantendo controles de edição de forma discreta e sutil. O objetivo é que o preview simule a experiência do usuário final, mas ainda permita edição direta dos elementos através de controles sutis que aparecem no hover.

## Pré-requisitos

- Editor básico funcionando (Sprint 01)
- Sistema de store Zustand (`useEditorStore`) implementado
- Componentes de elementos base existentes
- Roteamento Next.js App Router configurado

## Atividades

### 1. Análise e Mapeamento do Estado Atual

**Descrição:** Identificar componentes envolvidos no preview e mapear o que precisa ser refatorado
**Arquivos afetados:**

- `src/app/editor/page.tsx`
- `src/components/editor/*`
- `src/stores/editor-store.ts`

**Critérios de aceite:**

- [ ] Mapeamento completo dos componentes de preview atuais
- [ ] Identificação de controles de edição que devem ser sutilizados
- [ ] Documentação da arquitetura atual vs. desejada

### 2. Criação de Estado para Modo Preview

**Descrição:** Adicionar estado no store para controlar modo edição vs. preview discreto
**Arquivos afetados:**

- `src/stores/editor-store.ts`
- `src/types/components.ts`

**Critérios de aceite:**

- [ ] Estado `isPreviewMode` adicionado ao store
- [ ] Métodos `enablePreview()` e `enableEditing()` implementados
- [ ] Estado persiste durante navegação entre steps
- [ ] Preview mode mantém funcionalidade de seleção/edição
- [ ] Typings atualizados para incluir novo estado

### 3. Refatoração dos Controles de Elemento

**Descrição:** Tornar controles de edição discretos no modo preview com hover states
**Arquivos afetados:**

- `src/components/editor/ElementWrapper.tsx` (novo/refatorado)
- `src/components/editor/ElementControls.tsx` (novo)
- `src/components/editor/QuizPreview.tsx`

**Critérios de aceite:**

- [ ] Controles de edição quase invisíveis por padrão no preview
- [ ] Controles aparecem suavemente no hover sobre elementos
- [ ] Botões de editar/deletar mantêm funcionalidade completa
- [ ] Indicador sutil de elemento selecionado
- [ ] Transições CSS suaves para hover states
- [ ] Controles não interferem na experiência visual

### 4. Implementação de Scroll Vertical Melhorado

**Descrição:** Corrigir e otimizar scroll no preview para conteúdo longo
**Arquivos afetados:**

- `src/components/editor/QuizPreview.tsx`
- `src/styles/globals.css`
- `src/app/editor/page.tsx`

**Critérios de aceite:**

- [ ] Scroll vertical funciona corretamente em conteúdo longo
- [ ] Container do preview tem altura adequada e responsiva
- [ ] Scroll suave com boa performance
- [ ] Não interfere com controles de hover
- [ ] Funciona consistentemente em mobile/tablet/desktop
- [ ] Scroll personalizado e elegante (se necessário)

### 5. Toggle Elegante Entre Modos

**Descrição:** Implementar toggle visual entre modo edição completo e preview discreto
**Arquivos afetados:**

- `src/components/editor/EditorHeader.tsx` (novo)
- `src/components/ui/mode-toggle.tsx` (novo)
- `src/app/editor/page.tsx`

**Critérios de aceite:**

- [ ] Toggle button intuitivo e bem posicionado
- [ ] Feedback visual claro do modo atual
- [ ] Transição suave entre modos
- [ ] Atalho de teclado para alternar (ex: Tab)
- [ ] Ícones/labels descritivos para cada modo
- [ ] Estado persistido durante sessão

### 6. Refinamento da Experiência de Edição no Preview

**Descrição:** Manter funcionalidade de edição mas com UX mais elegante
**Arquivos afetados:**

- `src/components/editor/ElementWrapper.tsx`
- `src/components/editor/PropertiesPanel.tsx`
- `src/stores/editor-store.ts`

**Critérios de aceite:**

- [ ] Seleção de elemento funciona com clique no preview
- [ ] Painel de propriedades abre normalmente
- [ ] Visual feedback discreto para elemento selecionado
- [ ] Drag and drop mantido mas menos visualmente intrusivo
- [ ] Indicadores visuais sutis (bordas, sombras, etc.)
- [ ] Performance mantida durante interações

### 7. Sincronização e Estado Compartilhado

**Descrição:** Garantir sincronização perfeita entre todos os modos e componentes
**Arquivos afetados:**

- `src/stores/editor-store.ts`
- `src/components/editor/QuizPreview.tsx`
- `src/app/editor/page.tsx`

**Critérios de aceite:**

- [ ] Mudanças refletidas instantaneamente em ambos os modos
- [ ] Step atual sincronizado perfeitamente
- [ ] Seleção de elemento mantida ao alternar modos
- [ ] Dados sempre consistentes e atualizados
- [ ] Sem re-renders desnecessários
- [ ] Estado de undo/redo funcional

### 8. Validação e Polimento da UX

**Descrição:** Testar e refinar toda a experiência do usuário
**Arquivos afetados:**

- Todos os componentes criados/modificados

**Critérios de aceite:**

- [ ] Preview oferece experiência limpa mas funcional
- [ ] Controles discretos mas sempre acessíveis quando necessário
- [ ] Responsividade perfeita em todos os dispositivos
- [ ] Performance otimizada em ambos os modos
- [ ] Acessibilidade mantida com indicadores adequados
- [ ] Feedback visual consistente e intuitivo

## Validação

### Critérios de Sucesso:

1. **Preview Elegante:** Interface limpa que simula experiência do usuário, mas mantém edição acessível
2. **Controles Discretos:** Elementos de edição presentes mas sutis, aparecem no hover
3. **Scroll Perfeito:** Navegação vertical suave em conteúdo longo
4. **Edição Funcional:** Seleção, edição e exclusão de elementos funciona perfeitamente no preview
5. **Transições Suaves:** Alternância entre modos é fluida e intuitiva

### Testes de Aceitação:

- [ ] Criar quiz longo e testar scroll + edição
- [ ] Alternar entre modos e verificar consistência
- [ ] Testar hover states em diferentes elementos
- [ ] Validar edição de propriedades via preview
- [ ] Verificar responsividade em mobile
- [ ] Testar performance durante uso intenso

## Observações Técnicas

### Padrões de UX:

- Controles aparecem com opacity/transform suaves
- Hover states com timing de CSS transitions consistente
- Indicadores visuais discretos (bordas finas, sombras sutis)
- Feedback tátil através de mudanças visuais mínimas

### Performance:

- Use CSS transforms para animações de hover
- Evite re-renders em hover states (use CSS puro quando possível)
- Implemente throttling para scroll events se necessário
- React.memo para componentes de elemento quando apropriado

### Arquitetura:

- ElementWrapper como abstração para gerenciar estados visuais
- Preview reutilizável para futura interface pública
- Separação clara entre lógica de edição e apresentação
- Controles modulares e extensíveis

### Integração Futura:

- Base sólida para rota `/quiz/[id]` (sem controles de edição)
- Estrutura preparada para analytics e tracking
- Extensibilidade para diferentes tipos de elementos
- Compatibilidade com sistema de templates
