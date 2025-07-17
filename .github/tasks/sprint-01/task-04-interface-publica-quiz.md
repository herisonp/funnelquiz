# Interface Pública do Quiz

## Contexto

Implementar a experiência completa do usuário final para responder quizzes criados no editor. Esta interface deve ser otimizada para conversão, com foco na coleta de informações do usuário através de um fluxo sequencial e engajante. A interface deve renderizar todos os elementos suportados (texto, múltipla escolha, navegação) e coletar respostas temporariamente no localStorage.

## Pré-requisitos

- Sistema de elementos básicos implementado (TextElement, MultipleChoiceElement, NavigationButtonElement)
- Sistema de Steps funcional no editor
- Zustand store configurado com estrutura de Quiz/Steps/Elements
- Tipos definidos em `src/types/composed.ts` para elementos e respostas
- Componentes Shadcn/ui base instalados

## Atividades

### 1. Criar Layout Base da Interface Pública

**Descrição:** Implementar o layout responsivo da página pública do quiz com foco em conversão
**Arquivos afetados:**

- `src/app/quiz/preview/page.tsx`
- `src/components/quiz/QuizContainer.tsx`
- `src/components/quiz/QuizHeader.tsx`
- `src/components/quiz/QuizProgress.tsx`

**Critérios de aceite:**

- [ ] Página `/quiz/preview` renderiza corretamente
- [ ] Layout é mobile-first e responsivo
- [ ] Header mostra progresso visual do quiz
- [ ] Container centralizado com máximo de largura apropriada
- [ ] Espaçamento e tipografia otimizados para conversão

### 2. Implementar Renderização de Elementos Públicos

**Descrição:** Criar componentes de visualização pública para cada tipo de elemento
**Arquivos afetados:**

- `src/components/quiz/elements/PublicTextElement.tsx`
- `src/components/quiz/elements/PublicMultipleChoiceElement.tsx`
- `src/components/quiz/elements/PublicNavigationButton.tsx`
- `src/components/quiz/QuizElementRenderer.tsx`

**Critérios de aceite:**

- [ ] TextElement renderiza texto com styling correto
- [ ] MultipleChoiceElement permite seleção única ou múltipla
- [ ] NavigationButton aciona navegação entre steps
- [ ] Renderer seleciona componente correto baseado no tipo do elemento
- [ ] Elementos são acessíveis (ARIA labels, keyboard navigation)

### 3. Sistema de Navegação Entre Steps

**Descrição:** Implementar navegação sequencial e controle de fluxo do quiz
**Arquivos afetados:**

- `src/components/quiz/QuizNavigation.tsx`
- `src/hooks/useQuizNavigation.ts`
- `src/stores/useQuizResponseStore.ts`

**Critérios de aceite:**

- [ ] Usuário pode navegar para próximo step
- [ ] Botão "Voltar" funciona corretamente
- [ ] Validação de step antes de prosseguir
- [ ] Indicador visual de progresso atualiza
- [ ] Último step mostra tela de conclusão

### 4. Coleta e Armazenamento de Respostas

**Descrição:** Implementar sistema de coleta e persistência local de respostas do usuário
**Arquivos afetados:**

- `src/stores/useQuizResponseStore.ts`
- `src/types/api.ts` (tipos de Response/Answer)
- `src/hooks/useQuizResponse.ts`
- `src/lib/quiz-response-utils.ts`

**Critérios de aceite:**

- [ ] Respostas são coletadas automaticamente ao interagir com elementos
- [ ] Estado das respostas persiste no localStorage
- [ ] Respostas são organizadas por step e elemento
- [ ] Validação de dados antes de armazenar
- [ ] Recuperação de respostas ao retornar ao quiz

### 5. Tela de Conclusão e Resultado

**Descrição:** Implementar tela final com resumo das respostas e call-to-action
**Arquivos afetados:**

- `src/components/quiz/QuizCompletion.tsx`
- `src/components/quiz/ResponseSummary.tsx`
- `src/app/quiz/preview/complete/page.tsx`

**Critérios de aceite:**

- [ ] Tela de conclusão é exibida após último step
- [ ] Resumo das respostas é apresentado de forma clara
- [ ] Call-to-action configurável (email, telefone, etc.)
- [ ] Opção de reiniciar quiz
- [ ] Dados podem ser exportados (futuro: envio para API)

### 6. Integração com Editor (Preview Mode)

**Descrição:** Conectar interface pública com dados do editor para preview em tempo real
**Arquivos afetados:**

- `src/components/editor/PreviewMode.tsx`
- `src/hooks/useEditorPreview.ts`
- Atualizar `src/stores/useEditorStore.ts`

**Critérios de aceite:**

- [ ] Botão "Preview" no editor abre interface pública
- [ ] Dados do editor são sincronizados com preview
- [ ] Alterações no editor refletem no preview
- [ ] Modal ou nova aba para preview
- [ ] Modo de desenvolvimento vs. produção claro

## Validação

### Testes Funcionais

- [ ] Navegação completa do quiz funciona sem erros
- [ ] Respostas são coletadas e persistidas corretamente
- [ ] Interface é responsiva em mobile/tablet/desktop
- [ ] Todos os tipos de elementos renderizam corretamente
- [ ] Preview no editor reflete mudanças em tempo real

### Testes de Usabilidade

- [ ] Fluxo do quiz é intuitivo e fluido
- [ ] Tempo de carregamento < 2 segundos
- [ ] Interface funciona em Chrome, Firefox, Safari
- [ ] Acessibilidade básica (tab navigation, screen reader)

### Testes de Dados

- [ ] localStorage não corrompe com dados inválidos
- [ ] Respostas são formatadas corretamente
- [ ] Recuperação de estado funciona após refresh
- [ ] Validação impede submissão de dados incompletos

## Observações Técnicas

### Padrões do Projeto

- **Mobile-First:** Priorizar experiência mobile para máxima conversão
- **Server Components:** Usar quando possível, Client Components apenas para interatividade
- **Zustand Store:** Separar store de resposta do store do editor
- **Shadcn/ui:** Usar componentes base para consistência visual

### Considerações de Performance

- **Lazy Loading:** Carregar apenas step atual
- **Memoização:** React.memo para componentes de elemento
- **Bundle Size:** Minimizar JavaScript para carregamento rápido
- **Local Storage:** Implementar limpeza automática de dados antigos

### Acessibilidade

- **ARIA Labels:** Elementos de formulário bem rotulados
- **Keyboard Navigation:** Tab order lógico
- **Focus Management:** Foco visual claro
- **Screen Reader:** Compatibilidade básica

### Futura Integração com API

- Estrutura de dados compatível com modelo Prisma
- Hooks preparados para substituir localStorage por API calls
- Validação usando mesmos schemas que serão usados no backend
- Separação clara entre lógica de apresentação e dados

### Otimização para Conversão

- **Loading States:** Feedback visual durante transições
- **Micro-interactions:** Animações sutis para engajamento
- **Progress Indicators:** Mostrar progresso e tempo restante
- **Error Handling:** Mensagens de erro user-
