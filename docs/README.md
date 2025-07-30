# Funnel Quiz - Documentação

## Visão Geral

Sistema interativo de criação de formulários de pesquisa customizáveis voltado para funis de conversão de marketing.

## Tecnologias

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui
- **Backend**: Next.js Server Actions e API Routes
- **Database**: PostgreSQL com Prisma ORM
- **Containerização**: Docker (desenvolvimento)

## Estrutura do Projeto

```
funnelquiz/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── dashboard/
│   │   │   ├── (panel)/ # Painel de controle
│   │   │   ├── quiz/        # Dashboard de quizzes
│   │   ├── quiz/           # Public quiz interface
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn/ui components
│   │   ├── editor/        # Editor-specific components
│   │   ├── quiz/          # Quiz-specific components
│   │   └── common/        # Shared components
│   ├── lib/               # Utilities and configurations
│   │   ├── prisma.ts      # Prisma client
│   │   ├── utils.ts       # Utility functions
│   │   └── validations.ts # Zod schemas
│   ├── types/             # TypeScript type definitions
│   │   ├── quiz.ts        # Quiz-related types
│   │   ├── element.ts     # Element-related types
│   │   └── api.ts         # API-related types
│   └── hooks/             # Custom React hooks
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── docs/                  # Documentation
```

## Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Iniciar servidor de produção
- `npm run lint` - Executar ESLint

### Banco de Dados

- `npm run db:push` - Sincronizar schema com banco
- `npm run db:generate` - Gerar Prisma client
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Executar seed do banco
- `npm run db:reset` - Resetar banco de dados

## Configuração do Ambiente

### 1. Instalação

```bash
# Instalar dependências
npm install
```

### 2. Banco de Dados

```bash
# Iniciar PostgreSQL via Docker
docker-compose up -d

# Aplicar schema ao banco
npm run db:push

# Gerar cliente Prisma
npm run db:generate
```

### 3. Variáveis de Ambiente

Copie `.env.example` para `.env` e configure as variáveis:

```env
DATABASE_URL="postgresql://funnelquiz:funnelquiz123@localhost:5432/funnelquiz"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Desenvolvimento

```bash
# Iniciar aplicação
npm run dev
```

Acesse: http://localhost:3000

## Funcionalidades do MVP

### Editor de Quiz

- Interface visual para criação de quizzes
- Sistema de steps (etapas múltiplas)
- Elementos drag-and-drop
- Customização de propriedades

### Elementos Suportados

- **Texto**: Exibição de conteúdo
- **Múltipla Escolha**: Perguntas com opções
- **Navegação**: Botões para controle de fluxo

### Interface Pública

- URL única para cada quiz
- Navegação entre steps
- Coleta de respostas
- Interface responsiva

## Próximos Passos

1. **Tarefa 2**: Modelagem completa do banco de dados
2. **Tarefa 3**: Tipos e interfaces TypeScript
3. **Tarefa 4**: Componentes base da UI
4. **Tarefa 5**: Sistema de elementos

## Troubleshooting

### Erro de conexão com banco

- Verifique se o Docker está rodando
- Confirme a connection string no `.env`
- Execute `npm run db:push` para testar conexão

### Erro do Shadcn/ui

- Verifique o arquivo `components.json`
- Reinstale componentes: `npx shadcn@latest add [component]`

### Erro do Prisma

- Execute `npm run db:generate` após mudanças no schema
- Verifique se o PostgreSQL está acessível
