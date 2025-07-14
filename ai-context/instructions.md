### Prompt de Instrução Geral para Desenvolvimento

Você está participando do desenvolvimento de uma aplicação web full stack chamada **Funnel Quiz**, um sistema interativo de criação de formulários de pesquisa customizáveis voltado para funis de conversão de marketing. O objetivo principal é permitir que usuários criem questionários compostos por múltiplos steps (etapas), onde cada step corresponde a uma tela única e independente. Em cada tela, o usuário pode adicionar, remover, personalizar e organizar diferentes elementos e tipos de input de resposta, de forma visual e intuitiva.

**Importante**: O sistema não é um quiz tradicional de perguntas certas ou erradas. Embora possa incluir essa funcionalidade quando necessário, a ideia principal é **coletar informações do usuário**, funcionando como um formulário de pesquisa interativo. O diferencial está em ser visualmente atraente (dependendo do bom senso do criador) e estrategicamente elaborado do ponto de vista de marketing, onde cada pergunta e cada tela são pensadas para guiar o usuário através de uma jornada de descoberta e engajamento.

A aplicação possui duas interfaces principais:

1. **Ambiente de Criação/Edição**: Onde os usuários (criadores) constroem e customizam seus formulários interativos de forma visual
2. **Interface Pública**: Onde cada formulário criado possui uma URL única e independente para que usuários finais possam acessar e responder

**Propósito Estratégico**: Esta ferramenta é projetada especificamente para ser utilizada em funis de conversão de marketing digital. Os formulários servem como um mecanismo estratégico para guiar o usuário final através de uma jornada interativa que o conduza gradualmente até a decisão de compra, coletando informações valiosas sobre suas preferências, necessidades e perfil ao longo do processo. Cada pergunta é elaborada estrategicamente para engajar o usuário e obter insights comportamentais e demográficos relevantes.

A experiência de construção deve ser semelhante ao plugin **Elementor** do WordPress: o usuário pode arrastar e soltar elementos na tela, personalizar propriedades de cada componente (cores, textos, tamanhos, lógica de exibição, etc.) e visualizar em tempo real como ficará o formulário final. O sistema deve ser altamente flexível, permitindo a criação desde formulários simples até questionários complexos, com múltiplos tipos de perguntas, respostas condicionais, lógica de navegação entre steps, e customização visual avançada.

#### Referências de UX/UI e funcionalidades:

- [Inlead Digital](https://inlead.digital)
- [FunnelFox](https://funnelfox.com)

#### Stack Tecnológica:

- **Frontend:** Next.js (React), Typescript, Shadcn/ui, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM para acesso e modelagem de dados, Typescript
- **Banco de Dados:** Compatível com Prisma (ex: PostgreSQL)
- **Outros requisitos:** Código limpo, modular, reutilizável, com foco em performance, acessibilidade e responsividade.

#### Padrões de Desenvolvimento e Codificação:

- **Componentes UI**: Utilize sempre que possível os componentes do **Shadcn/ui** como base para a interface
- **Estilização**: Use **Tailwind CSS** para toda a estilização da interface, seguindo as classes utilitárias
- **Paleta de Cores**: Trabalhe com as cores padrão do Shadcn/ui (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring)
- **Next.js SSR**: Implemente as recomendações mais recentes de Server-Side Rendering do Next.js, incluindo:
  - App Router ao invés de Pages Router
  - Server Components por padrão
  - Client Components apenas quando necessário (use "use client")
  - Streaming e Suspense para carregamento otimizado
  - Server Actions para mutations
- **Estrutura de Componentes**: Crie componentes reutilizáveis e modulares, seguindo o padrão de composição
- **Tipagem**: Use TypeScript de forma rigorosa, definindo interfaces e tipos específicos para cada domínio
- **Acessibilidade**: Garanta que todos os componentes sigam padrões WCAG através dos componentes Shadcn/ui

#### Regras e Diretrizes Gerais:

- O sistema deve ser escalável e fácil de manter.
- O código deve seguir boas práticas de desenvolvimento, com tipagem forte (Typescript) e uso de componentes reutilizáveis.
- O backend deve ser estruturado para suportar múltiplos quizzes, múltiplos steps por quiz, e múltiplos elementos por step.
- O editor visual deve ser intuitivo, com drag-and-drop, e permitir a customização de cada elemento.
- A interface deve ser responsiva e acessível.
- Cada quiz criado deve ter uma URL única e pública para acesso dos usuários finais.
- O sistema deve ser otimizado para conversão, com foco na experiência do usuário final que responderá aos quizzes.
- Sempre que possível, inspire-se nas referências citadas para UX, UI e fluxo de criação.

#### Objetivo deste contexto:

Este prompt serve como contexto fixo para qualquer task, feature ou ajuste solicitado durante o desenvolvimento deste projeto. Todas as instruções, sugestões de código, arquitetura, design de banco de dados, componentes, fluxos de usuário e integrações devem considerar este contexto como base.
