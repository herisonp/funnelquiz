# Tarefa 1: Configuração Inicial do Projeto

## Visão Geral

Completar a configuração da base técnica do projeto Funnel Quiz, adicionando Shadcn/ui, Prisma ORM, PostgreSQL e estrutura de pastas otimizada ao projeto Next.js existente.

## Estado Atual do Projeto

✅ **Já Configurado:**

- Next.js 15.3.5 com App Router
- TypeScript configurado
- Tailwind CSS 4.0 configurado
- ESLint configurado
- Estrutura inicial com path aliases (`@/*`)

## Subtarefas Pendentes

### 1.1 Instalar e configurar Shadcn/ui

**Objetivo**: Configurar sistema de design consistente com Shadcn/ui

**Comandos**:

```bash
# Instalar e inicializar Shadcn/ui
npx shadcn@latest init

# Instalar componentes base essenciais
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add toast
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add badge
npx shadcn@latest add skeleton
```

**Verificações**:

- [ ] Arquivo `components.json` criado e configurado
- [ ] Pasta `src/components/ui` criada com componentes base
- [ ] Arquivo `src/lib/utils.ts` com utilitários do Shadcn
- [ ] CSS global atualizado com variáveis do Shadcn
- [ ] Componentes renderizando corretamente

### 1.2 Configurar Prisma ORM

**Objetivo**: Configurar ORM para gerenciamento do banco de dados

**Comandos**:

```bash
# Instalar Prisma
npm install prisma @prisma/client

# Inicializar Prisma
npx prisma init
```

**Configurações necessárias**:

- [ ] Arquivo `.env` com `DATABASE_URL`
- [ ] Arquivo `prisma/schema.prisma` configurado
- [ ] Provider configurado para PostgreSQL

**Conteúdo do schema inicial**:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Verificações**:

- [ ] Prisma CLI funcionando
- [ ] Arquivo de schema criado
- [ ] Variável de ambiente configurada
- [ ] Cliente Prisma instalado

### 1.3 Configurar banco de dados PostgreSQL

**Objetivo**: Configurar instância PostgreSQL para desenvolvimento

**Opção 1 - Local com Docker**:

```bash
# Criar arquivo docker-compose.yml na raiz do projeto
touch docker-compose.yml
```

**Conteúdo do docker-compose.yml**:

```yaml
services:
  postgres:
    image: postgres:15
    container_name: funnelquiz-db
    environment:
      POSTGRES_USER: funnelquiz
      POSTGRES_PASSWORD: funnelquiz123
      POSTGRES_DB: funnelquiz
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Opção 2 - Serviço cloud (Supabase/Neon)**:

- Criar projeto no serviço escolhido
- Obter connection string
- Configurar no `.env`

**Configuração do .env**:

```env
# Database
DATABASE_URL="postgresql://funnelquiz:funnelquiz123@localhost:5432/funnelquiz"

# Next Auth (para futuras implementações)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Verificações**:

- [ ] Banco PostgreSQL rodando e acessível
- [ ] Connection string funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Conexão testada com `npx prisma db push`

### 1.4 Configurar estrutura de pastas do projeto

**Objetivo**: Organizar arquitetura de pastas para escalabilidade

**Estrutura a ser criada**:

```
funnelquiz/
├── src/
│   ├── app/                      # ✅ Já existe
│   │   ├── api/                  # ❌ Criar
│   │   ├── editor/               # ❌ Criar
│   │   ├── quiz/                 # ❌ Criar
│   │   ├── globals.css           # ✅ Já existe
│   │   ├── layout.tsx            # ✅ Já existe
│   │   └── page.tsx              # ✅ Já existe
│   ├── components/               # ❌ Criar
│   │   ├── ui/                   # ❌ Será criado pelo Shadcn
│   │   ├── editor/               # ❌ Criar
│   │   ├── quiz/                 # ❌ Criar
│   │   └── common/               # ❌ Criar
│   ├── lib/                      # ❌ Criar
│   │   ├── prisma.ts            # ❌ Criar
│   │   ├── utils.ts             # ❌ Será criado pelo Shadcn
│   │   └── validations.ts       # ❌ Criar
│   ├── types/                    # ❌ Criar
│   │   ├── quiz.ts              # ❌ Criar
│   │   ├── element.ts           # ❌ Criar
│   │   └── api.ts               # ❌ Criar
│   └── hooks/                    # ❌ Criar
├── prisma/                       # ❌ Será criado pelo Prisma
├── public/                       # ✅ Já existe
└── docs/                        # ❌ Criar
```

**Comandos para criar estrutura**:

```bash
# Criar pastas principais
mkdir -p src/app/api src/app/editor src/app/quiz
mkdir -p src/components/editor src/components/quiz src/components/common
mkdir -p src/lib src/types src/hooks
mkdir -p docs

# Criar arquivos placeholder
touch src/components/editor/.gitkeep
touch src/components/quiz/.gitkeep
touch src/components/common/.gitkeep
touch src/lib/prisma.ts
touch src/lib/validations.ts
touch src/types/quiz.ts
touch src/types/element.ts
touch src/types/api.ts
touch src/hooks/.gitkeep
touch docs/README.md
```

**Verificações**:

- [ ] Todas as pastas criadas
- [ ] Arquivos placeholder criados
- [ ] Imports funcionando corretamente com path aliases

### 1.5 Instalar dependências adicionais

**Objetivo**: Instalar bibliotecas necessárias para o desenvolvimento

**Comandos**:

```bash
# Dependências para formulários e validação
npm install @hookform/resolvers react-hook-form zod

# Utilitários para classes CSS
npm install class-variance-authority clsx tailwind-merge

# Ícones
npm install lucide-react

# Dependências de desenvolvimento
npm install -D tsx
```

**Verificações**:

- [ ] Todas as dependências instaladas
- [ ] Package.json atualizado
- [ ] Sem conflitos de dependências

## Configurações Adicionais

### Atualizar scripts do package.json

Adicionar scripts para Prisma e desenvolvimento:

```json
{
  "scripts": {
    // ...existing scripts...
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset"
  }
}
```

### Arquivo de configuração do Prisma client

Criar `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## Critérios de Conclusão

A tarefa 1 estará completa quando:

- [ ] Shadcn/ui instalado e funcionando
- [ ] Prisma conectando com PostgreSQL
- [ ] Estrutura de pastas criada e organizada
- [ ] Scripts de desenvolvimento funcionando
- [ ] Dependências instaladas e funcionando
- [ ] Cliente Prisma configurado
- [ ] Projeto rodando em `http://localhost:3000` sem erros

## Próximos Passos

Após conclusão, prosseguir para:

- **Tarefa 2**: Modelagem de Dados (schema Prisma)
- **Tarefa 3**: Tipos e Interfaces TypeScript

## Troubleshooting Comum

### Erro de conexão com PostgreSQL

- Verificar se o Docker está rodando
- Confirmar connection string no `.env`
- Testar com `npx prisma db push`

### Erro de importação do Shadcn/ui

- Verificar `components.json`
- Confirmar que o Tailwind está funcionando
- Reinstalar componentes se necessário

### Erro no Prisma

- Verificar se o PostgreSQL está acessível
- Confirmar variáveis de ambiente
- Executar `npx prisma generate` após mudanças no schema
