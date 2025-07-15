# Sprint 01 - MVP Core: Editor e Visualizador de Quiz

## Objetivo Principal

Implementar as funcionalidades essenciais do MVP: tela de criação/edição de quiz único, visualização pública e elementos básicos (texto, múltipla escolha e navegação).

## Contexto

Esta é a sprint fundacional do Funnel Quiz, focando em estabelecer o ciclo completo de criação e consumo de um quiz. Priorizamos a experiência básica de usuário (criador → editor → público) com o mínimo de elementos necessários para validar o conceito de ferramenta de conversão.

## Tarefas Macro

### 🚀 Prioridade Alta (P1)

#### 1. Estrutura Base do Editor

- **Complexidade:** M
- **Descrição:** Implementar interface principal do editor com sidebar de elementos e canvas de edição
- **Entregáveis:**
  - Página `/editor` funcional
  - Layout responsivo com drag area
  - Sidebar com elementos disponíveis
  - Header com ações básicas (preview, reset)
- **Dependências:** Nenhuma
- **Critérios de Aceite Macro:**
  - [ ] Interface do editor renderiza corretamente
  - [ ] Layout responsivo em desktop e tablet
  - [ ] Navegação entre editor e preview funcional

#### 2. Sistema de Elementos Básicos

- **Complexidade:** G
- **Descrição:** Implementar 3 elementos essenciais: texto, múltipla escolha e botão de navegação
- **Entregáveis:**
  - Componente TextElement com edição inline
  - Componente MultipleChoiceElement com opções dinâmicas
  - Componente NavigationButtonElement para próxima etapa
  - Properties panel para cada tipo
- **Dependências:** Tarefa 1
- **Critérios de Aceite Macro:**
  - [ ] Elementos são renderizados no editor
  - [ ] Propriedades são editáveis via sidebar
  - [ ] Elementos mantêm estado no Zustand store
  - [ ] Preview mostra elementos corretamente

#### 3. Sistema de Steps (Etapas)

- **Complexidade:** M
- **Descrição:** Implementar gerenciamento de múltiplas etapas dentro do quiz
- **Entregáveis:**
  - Interface de navegação entre steps
  - Adicionar/remover steps
  - Reordenação de steps
  - Indicador visual de step atual
- **Dependências:** Tarefa 1, 2
- **Critérios de Aceite Macro:**
  - [ ] Usuário pode criar/deletar steps
  - [ ] Navegação entre steps funciona no editor
  - [ ] Estado dos elementos é preservado por step
  - [ ] Máximo de 5 steps para MVP

### ⚡ Prioridade Média (P2)

#### 4. Interface Pública do Quiz

- **Complexidade:** M
- **Descrição:** Criar experiência de usuário final para responder o quiz
- **Entregáveis:**
  - Página `/quiz/preview` (mock data)
  - Navegação sequencial entre steps
  - Coleta e armazenamento temporário de respostas
  - Layout otimizado para conversão
- **Dependências:** Tarefa 2, 3
- **Critérios de Aceite Macro:**
  - [ ] Quiz renderiza corretamente para usuário final
  - [ ] Respostas são coletadas localmente
  - [ ] Navegação between steps é fluida
  - [ ] Interface é mobile-friendly

#### 5. Persistência Local de Quiz

- **Complexidade:** M
- **Descrição:** Implementar salvamento/carregamento do quiz usando localStorage
- **Entregáveis:**
  - Auto-save no editor
  - Recuperação de estado ao recarregar página
  - Export/import de configuração de quiz
  - Validação de estrutura de dados
- **Dependências:** Tarefa 1, 2, 3
- **Critérios de Aceite Macro:**
  - [ ] Quiz é salvo automaticamente no localStorage
  - [ ] Estado é recuperado ao reabrir editor
  - [ ] Dados são validados antes de salvar
  - [ ] Fallback para quiz vazio se dados corrompidos

### 🔧 Prioridade Baixa (P3)

#### 6. Validações e UX Melhorias

- **Complexidade:** P
- **Descrição:** Implementar validações básicas e melhorias de experiência
- **Entregáveis:**
  - Validação de quiz antes de preview
  - Loading states e feedback visual
  - Tooltips e help text
  - Atalhos de teclado básicos
- **Dependências:** Tarefas 1-5
- **Critérios de Aceite Macro:**
  - [ ] Usuário recebe feedback claro sobre erros
  - [ ] Loading states são exibidos adequadamente
  - [ ] Interface é intuitiva sem documentação

#### 7. Styling e Design System

- **Complexidade:** P
- **Descrição:** Refinar aparência e consistência visual do produto
- **Entregáveis:**
  - Theme customizado baseado em Shadcn
  - Componentes visuais polidos
  - Animações sutis para interações
  - Dark/light mode toggle
- **Dependências:** Todas as anteriores
- **Critérios de Aceite Macro:**
  - [ ] Interface é visualmente atrativa
  - [ ] Cores e tipografia são consistentes
  - [ ] Animações melhoram a experiência

## Fluxo de Execução

```
Tarefa 1 → Tarefa 2 → Tarefa 3
           ↓           ↓
         Tarefa 4 → Tarefa 5
           ↓           ↓
         Tarefa 6 → Tarefa 7
```

## Riscos e Mitigações

| Risco                               | Probabilidade | Impacto | Mitigação                                                        |
| ----------------------------------- | ------------- | ------- | ---------------------------------------------------------------- |
| Complexidade do drag-and-drop       | Média         | Alto    | Usar @dnd-kit já configurado, começar com funcionalidade simples |
| State management entre componentes  | Média         | Médio   | Aproveitar Zustand store já estruturado, testes incrementais     |
| Responsividade em mobile            | Alta          | Médio   | Desenvolvimento mobile-first, testes contínuos                   |
| Performance com múltiplos elementos | Baixa         | Médio   | Otimização de re-renders, React.memo quando necessário           |
| Validação de dados complexos        | Média         | Baixo   | Schema validation com Zod, validação incremental                 |

## Definição de Pronto (DoD)

- [ ] Código implementado e revisado
- [ ] Testes unitários/integração passando
- [ ] Interface funcional e responsiva
- [ ] Documentação técnica atualizada
- [ ] Deploy em ambiente de staging realizado
- [ ] Funcionalidade testada em Chrome, Firefox e Safari
- [ ] Responsividade validada em mobile/tablet
- [ ] Performance aceitável (< 3s carregamento inicial)

## Retrospectiva Planejada

Pontos para discussão ao final da sprint:

- Efetividade do sistema de elementos polimorfo
- Usabilidade do editor drag-and-drop
- Performance do estado global (Zustand)
- Qualidade da experiência mobile
- Preparação para próximas features (persistência BD, múltiplos quizzes)

## Notas Técnicas

- **Foco no MVP:** Funcionalidade > Perfeição visual
- **Mock Data:** Usar dados simulados, preparar para API futura
- **Element Registry:** Aproveitar sistema já estruturado em `element-definitions.ts`
- **TypeScript:** Manter tipagem forte, especialmente para element content
- **Next.js:** Usar App Router, Server Components onde apropriado
