# Refinamento do Canvas Central

## Contexto

Otimizar o layout e feedback visual do canvas do editor para destacá-lo como área principal de edição, proporcionando uma experiência mais profissional e intuitiva similar às ferramentas de referência do mercado (Elementor, FunnelFox).

## Pré-requisitos

- Componente Canvas existente no editor (`src/components/editor/`)
- Sistema de drag-and-drop com @dnd-kit implementado
- Zustand store (`useEditorStore`) funcionando
- Shadcn/ui components disponíveis
- Tailwind CSS configurado

## Atividades

### 1. Aprimorar Layout e Espaçamento do Canvas

**Descrição:** Otimizar o layout do canvas para ocupar o espaço disponível de forma mais eficiente, criando maior destaque visual.

**Arquivos afetados:**

- `src/components/editor/Canvas.tsx`
- `src/app/editor/page.tsx` (layout da página)

**Critérios de aceite:**

- [ ] Canvas ocupa pelo menos 60% da largura disponível em desktop
- [ ] Margens e padding otimizados para maximizar área útil
- [ ] Layout responsivo mantido (mobile, tablet, desktop)
- [ ] Scroll vertical suave quando conteúdo excede altura da tela

### 2. Implementar Bordas e Sombras Sutis

**Descrição:** Adicionar elementos visuais que destaquem o canvas como área principal de trabalho, usando bordas e sombras sutis.

**Arquivos afetados:**

- `src/components/editor/Canvas.tsx`
- Possível criação de `src/components/ui/canvas-container.tsx`

**Critérios de aceite:**

- [ ] Borda sutil (1px) com cor da paleta Shadcn/ui
- [ ] Sombra suave (shadow-sm ou similar) aplicada
- [ ] Cantos arredondados consistentes com design system
- [ ] Estados visuais diferentes para foco/hover do canvas
- [ ] Compatibilidade com dark/light mode

### 3. Melhorar Feedback para Estados Vazios

**Descrição:** Criar mensagens de instrução claras e elementos visuais quando o canvas está vazio, guiando o usuário nas primeiras interações.

**Arquivos afetados:**

- `src/components/editor/Canvas.tsx`
- `src/components/editor/EmptyCanvasState.tsx` (novo componente)

**Critérios de aceite:**

- [ ] Componente EmptyCanvasState criado com design consistente
- [ ] Mensagem de instrução clara (ex: "Arraste elementos da barra lateral")
- [ ] Ícone representativo (cursor com seta ou similar)
- [ ] Call-to-action visual destacando a sidebar
- [ ] Animação sutil de entrada/saída do estado vazio
- [ ] Condição de exibição baseada na ausência de elementos no step atual

### 4. Implementar Indicadores Visuais de Área Ativa

**Descrição:** Adicionar feedback visual durante interações de drag-and-drop e seleção de elementos, melhorando a experiência de edição.

**Arquivos afetados:**

- `src/components/editor/Canvas.tsx`
- `src/components/editor/DroppableArea.tsx` (se existir)
- `src/hooks/useEditorStore.ts` (possível extensão)

**Critérios de aceite:**

- [ ] Highlight sutil quando canvas está recebendo drag
- [ ] Área de drop claramente demarcada durante drag-over
- [ ] Feedback visual quando elemento está selecionado
- [ ] Indicador de posição durante inserção de novos elementos
- [ ] Animações fluidas sem impacto na performance
- [ ] Estados visuais consistentes com design system

### 5. Otimizar Performance Visual

**Descrição:** Garantir que todas as melhorias visuais não impactem negativamente a performance, especialmente durante interações frequentes.

**Arquivos afetados:**

- `src/components/editor/Canvas.tsx`
- Componentes de elementos individuais se necessário

**Critérios de aceite:**

- [ ] Uso de CSS transforms para animações
- [ ] Propriedade will-change aplicada adequadamente
- [ ] Debounce em eventos de mouse quando necessário
- [ ] Lazy loading de elementos visuais não críticos
- [ ] Memoização de componentes pesados
- [ ] Tempo de resposta < 16ms para interações principais

## Validação

### Testes de Interface

- [ ] Canvas responsivo em dispositivos móveis, tablets e desktop
- [ ] Estados vazios exibidos corretamente
- [ ] Feedback visual funcional durante drag-and-drop
- [ ] Performance mantida em quizzes com muitos elementos

### Testes de Usabilidade

- [ ] Usuário entende claramente onde arrastar elementos
- [ ] Canvas se destaca visualmente como área principal
- [ ] Mensagens de instrução são claras e úteis
- [ ] Interações são intuitivas e responsivas

### Testes Técnicos

- [ ] Zustand store não afetado pelas mudanças visuais
- [ ] Compatibilidade com @dnd-kit mantida
- [ ] Acessibilidade básica preservada
- [ ] Build de produção funcionando sem erros

## Observações Técnicas

### Padrões do Projeto

- **Shadcn/ui**: Usar componentes base (Card, Button) como foundation
- **Tailwind CSS**: Seguir classes utilitárias, evitar CSS customizado
- **Next.js App Router**: Manter server components quando possível
- **Zustand**: Não alterar estrutura do store, apenas consumir estados

### Considerações de Design

- **Mobile-first**: Priorizar experiência em dispositivos móveis
- **Acessibilidade**: Manter contrast ratios e navegação por teclado
- **Performance**: Usar CSS transforms para animações fluidas
- **Consistência**: Seguir paleta de cores e espaçamentos do design system

### Arquitetura

- Manter separação entre componentes de UI e lógica de negócio
- Canvas como container, elementos como children independentes
- Estados visuais gerenciados via CSS classes e data attributes
- Evitar re-renders desnecessários durante interações visuais

```

```
