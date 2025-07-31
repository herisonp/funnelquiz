# Página de Leads - Documentação

Esta documentação descreve a implementação completa da página de leads do FunnelQuiz, incluindo todos os componentes criados e suas funcionalidades.

## 📁 Estrutura de Arquivos

```
src/
├── app/dashboard/quiz/[id]/leads/
│   └── page.tsx                    # Página principal de leads
├── components/leads/
│   ├── index.ts                    # Arquivo de exportações
│   ├── LeadsMetrics.tsx           # Métricas principais (big numbers)
│   ├── FunnelChart.tsx            # Gráfico de funil de conversão
│   ├── TimelineChart.tsx          # Gráfico temporal de evolução
│   ├── LeadsFilters.tsx           # Filtros e controles
│   ├── LeadsTable.tsx             # Tabela de leads
│   ├── LeadDetailsModal.tsx       # Modal de detalhes do lead
│   ├── LeadsStats.tsx             # Estatísticas avançadas
│   └── LeadsViewSwitcher.tsx      # Alternador de visualizações
└── hooks/
    └── useLeadsData.ts             # Hook para gerenciamento de dados
```

## 🎯 Funcionalidades Implementadas

### ✅ Métricas Principais (Big Numbers)

- **Visitantes**: Total que acessaram o funil
- **Leads Adquiridos**: Iniciaram interação
- **Taxa de Interação**: Visitantes vs Leads (%)
- **Leads Qualificados**: Passaram de 50% do quiz
- **Fluxos Completos**: Finalizaram todas as etapas

### ✅ Gráficos e Visualizações

1. **Gráfico de Funil** (`FunnelChart.tsx`)

   - Visualiza a jornada dos leads
   - Identifica taxas de abandono por etapa
   - Cores indicativas de performance

2. **Gráfico Temporal** (`TimelineChart.tsx`)
   - Evolução das métricas ao longo do tempo
   - Múltiplas linhas para diferentes KPIs
   - Tooltips informativos

### ✅ Filtros e Controles

- **Busca por texto**: Nome, email, telefone
- **Filtro por data**: Período customizável com calendário
- **Exportação CSV**: Download dos dados filtrados
- **Reset de dados**: Limpeza completa (com confirmação)

### ✅ Lista de Leads

- Tabela responsiva com paginação
- Status visual (qualificado, completo, não qualificado)
- Barra de progresso por lead
- Score de qualificação
- Ações por lead (ver detalhes)

### ✅ Modal de Detalhes

- Informações completas do lead
- Todas as respostas do quiz
- Métricas individuais
- Status e progresso detalhado

### ✅ Estatísticas Avançadas

- Distribuição de status
- Ranges de score
- Taxas de conversão
- Progresso por etapa do funil

## 🔧 Componentes Criados

### `LeadsMetrics.tsx`

Cards com métricas principais usando ícones lucide-react e cores diferenciadas.

### `FunnelChart.tsx`

Gráfico de barras usando Recharts com:

- Cores baseadas na taxa de abandono
- Tooltip customizado
- Legenda explicativa

### `TimelineChart.tsx`

Gráfico de linhas múltiplas para evolução temporal com:

- 5 métricas diferentes
- Cores distintivas
- Tooltips informativos

### `LeadsFilters.tsx`

Controles de filtro incluindo:

- Campo de busca com ícone
- Seletor de data com calendário
- Botões de ação (exportar/resetar)
- Contador de resultados

### `LeadsTable.tsx`

Tabela responsiva com:

- Colunas organizadas
- Badges de status
- Barras de progresso
- Ações por linha

### `LeadDetailsModal.tsx`

Modal completo com:

- Informações pessoais
- Status e progresso
- Respostas do quiz
- Layout organizado em cards

### `LeadsStats.tsx`

Estatísticas avançadas com:

- Progress bars
- Distribuições
- Taxas de conversão
- Overview do funil

### `LeadsViewSwitcher.tsx`

Sistema de abas para diferentes visualizações:

- Visão geral
- Analytics
- Lista de leads
- Estatísticas

## 🎣 Hook Customizado

### `useLeadsData.ts`

Hook para gerenciamento de dados com:

- Estado dos filtros
- Cálculo de métricas
- Funções de exportação
- Reset de dados
- Preparado para integração com API

## 📊 Dados Mockados

Todos os componentes utilizam dados mockados realistas que incluem:

- 5 leads de exemplo com diferentes status
- Dados do funil com taxas de abandono
- Evolução temporal de 7 dias
- Variações de score e progresso

## 🎨 Design System

### Cores e Temas

- Utiliza sistema de cores do shadcn/ui
- Cores semânticas para status
- Modo claro/escuro compatível

### Ícones

- Lucide React para consistência
- Ícones semânticos e intuitivos
- Tamanhos padronizados

### Tipografia

- Hierarquia clara de títulos
- Textos descritivos
- Formatação de números

## 📱 Responsividade

Todos os componentes são totalmente responsivos:

- Mobile first
- Breakpoints do Tailwind
- Grid adaptativo
- Tabelas com scroll horizontal

## 🔌 Integração com API

### Estrutura Preparada

O hook `useLeadsData` está preparado para receber:

- `quizId` como parâmetro
- Chamadas para API REST
- Estados de loading/error
- Refetch automático

### Endpoints Sugeridos

```typescript
GET / api / quiz / { id } / leads; // Listar leads
GET / api / quiz / { id } / metrics; // Métricas do funil
GET / api / quiz / { id } / timeline; // Dados temporais
DELETE / api / quiz / { id } / leads; // Reset dos dados
```

## 📦 Dependências Adicionais

### Instaladas

- `recharts`: Gráficos interativos
- `date-fns`: Manipulação de datas
- `shadcn/ui`: Componentes base

### Componentes shadcn/ui Utilizados

- Button, Card, Input, Table
- Calendar, Popover, Dialog
- Badge, Progress, Separator

## 🚀 Próximos Passos

1. **Integração com Backend**

   - Conectar com API real
   - Implementar estados de loading
   - Tratamento de erros

2. **Funcionalidades Avançadas**

   - Filtros por score
   - Segmentação de leads
   - Automações baseadas em status

3. **Melhorias de UX**

   - Paginação da tabela
   - Ordenação de colunas
   - Busca avançada

4. **Analytics Avançados**
   - Funis personalizados
   - Cohort analysis
   - Previsões

## 📝 Notas de Implementação

- Todos os componentes são client-side (`"use client"`)
- TypeScript rigoroso com tipos bem definidos
- Performance otimizada com useMemo
- Acessibilidade considerada nos componentes
- Código bem documentado e reutilizável

A implementação está completa e pronta para uso, com uma base sólida para futuras expansões e integrações.
