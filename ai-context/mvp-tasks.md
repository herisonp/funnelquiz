# MVP - Funnel Quiz - Tarefas de Desenvolvimento

## Visão Geral do MVP

Sistema básico que permite criar um único quiz interativo com múltiplas etapas, incluindo elementos de texto, perguntas de múltipla escolha e navegação entre steps, com URL pública para usuários finais.

## Lista de Tarefas (Ordem Cronológica)

### 1. Configuração Inicial do Projeto

- [ ] Configurar projeto Next.js com TypeScript
- [ ] Instalar e configurar Shadcn/ui + Tailwind CSS
- [ ] Configurar Prisma ORM
- [ ] Configurar banco de dados PostgreSQL
- [ ] Configurar estrutura de pastas do projeto

### 2. Modelagem de Dados

- [ ] Criar schema Prisma para Quiz
- [ ] Criar schema Prisma para Step (etapas)
- [ ] Criar schema Prisma para Element (elementos dos steps)
- [ ] Criar schema Prisma para Response (respostas dos usuários)
- [ ] Executar migrations iniciais

### 3. Tipos e Interfaces TypeScript

- [ ] Definir tipos base para Quiz, Step, Element
- [ ] Definir tipos para diferentes elementos (texto, múltipla escolha, botão)
- [ ] Criar interfaces para props dos componentes
- [ ] Definir tipos para respostas e navegação

### 4. Componentes Base UI

- [ ] Criar componente de Layout principal
- [ ] Criar componente de Header
- [ ] Criar componente de Container/Wrapper
- [ ] Criar componentes básicos de navegação

### 5. Sistema de Elementos (Building Blocks)

- [ ] Criar componente Element Text (exibição de texto)
- [ ] Criar componente Element Multiple Choice (pergunta múltipla escolha)
- [ ] Criar componente Element Navigation Button (botão avançar)
- [ ] Criar sistema de renderização dinâmica de elementos

### 6. Editor/Criador de Quiz (Ambiente de Criação)

- [ ] Criar página principal do editor (`/editor`)
- [ ] Criar sidebar com lista de elementos disponíveis
- [ ] Implementar área de preview/canvas central
- [ ] Criar painel de propriedades para customização
- [ ] Implementar sistema de adicionar elementos aos steps

### 7. Gerenciamento de Steps

- [ ] Criar componente de lista de steps (navegação lateral)
- [ ] Implementar criação de novos steps
- [ ] Implementar navegação entre steps no editor
- [ ] Implementar remoção de steps
- [ ] Implementar reordenação de steps

### 8. Funcionalidades do Editor

- [ ] Implementar adição de elementos aos steps
- [ ] Implementar remoção de elementos
- [ ] Implementar reordenação de elementos dentro do step
- [ ] Implementar edição de propriedades dos elementos (texto, opções, etc.)

### 9. API Routes (Backend)

- [ ] Criar API route para salvar quiz (`POST /api/quiz`)
- [ ] Criar API route para buscar quiz (`GET /api/quiz/[id]`)
- [ ] Criar API route para atualizar quiz (`PUT /api/quiz/[id]`)
- [ ] Criar API route para salvar respostas (`POST /api/quiz/[id]/response`)

### 10. Persistência de Dados

- [ ] Implementar salvamento automático do quiz no editor
- [ ] Implementar carregamento do quiz existente no editor
- [ ] Implementar validação de dados antes do salvamento

### 11. Interface Pública do Quiz

- [ ] Criar página pública do quiz (`/quiz/[id]`)
- [ ] Implementar renderização dos elements do step atual
- [ ] Implementar sistema de navegação entre steps
- [ ] Implementar coleta e armazenamento de respostas
- [ ] Implementar validação de respostas obrigatórias

### 12. Sistema de Navegação do Quiz Público

- [ ] Implementar lógica de "próximo step"
- [ ] Implementar lógica de "step anterior" (se necessário)
- [ ] Implementar indicador de progresso
- [ ] Implementar página de finalização

### 13. Funcionalidades de Preview

- [ ] Implementar modo preview no editor
- [ ] Criar botão "Visualizar Quiz" no editor
- [ ] Implementar transição suave entre modo edição e preview

### 14. Validações e Tratamento de Erros

- [ ] Implementar validação de dados no frontend
- [ ] Implementar tratamento de erros na API
- [ ] Implementar feedback visual para erros
- [ ] Implementar validação de quiz antes da publicação

### 15. Responsividade e UX

- [ ] Garantir responsividade do editor
- [ ] Garantir responsividade da interface pública
- [ ] Implementar loading states
- [ ] Implementar transições suaves entre steps

### 16. Testes e Refinamentos

- [ ] Testar fluxo completo de criação
- [ ] Testar fluxo completo de resposta do quiz
- [ ] Ajustar UX/UI baseado em testes
- [ ] Otimizar performance

### 17. Deploy e Configuração Final

- [ ] Configurar variáveis de ambiente
- [ ] Preparar para deploy
- [ ] Testar em ambiente de produção
- [ ] Documentar funcionalidades básicas

## Entregáveis do MVP

Ao final dessas tarefas, teremos:

- ✅ Editor visual para criar/editar um quiz único
- ✅ Sistema de steps (múltiplas etapas)
- ✅ Elemento de texto customizável
- ✅ Elemento de múltipla escolha
- ✅ Elemento de navegação entre steps
- ✅ Interface pública com URL única
- ✅ Sistema de coleta de respostas
- ✅ Interface responsiva e acessível

## Fora do Escopo do MVP

- ❌ Sistema de login/registro
- ❌ Múltiplos quizzes por usuário
- ❌ Elementos avançados (upload de imagem, etc.)
- ❌ Lógica condicional complexa
- ❌ Relatórios e analytics
- ❌ Integrações externas
