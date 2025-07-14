# Tarefa 2: Modelagem de Dados - Detalhamento de Atividades

## Contexto

Esta tarefa foca na criação completa da modelagem de dados do sistema Funnel Quiz através do schema Prisma, utilizando o `prisma generate` para automaticamente gerar os tipos TypeScript correspondentes.

## Estado Atual do Codebase

- ✅ Schema Prisma básico configurado com model User
- ✅ Tipos TypeScript parciais criados (Quiz, Step, Element)
- ❌ Schema Prisma incompleto (falta Quiz, Step, Element, Response)
- ❌ Tipos TypeScript com inconsistências e referências quebradas

## Atividades Detalhadas

### 2.1 Correção dos Tipos TypeScript Existentes

**Problema identificado**: O arquivo `element.ts` tem referências quebradas e duplicações.

**Ações necessárias**:

- [ ] Remover arquivos de tipos manuais (`/src/types/quiz.ts`, `/src/types/element.ts`, etc.)
- [ ] Limpar imports e referências aos tipos manuais no código existente
- [ ] Preparar código para utilizar tipos gerados pelo Prisma

**Resultado esperado**: Código limpo sem tipos manuais conflitantes.

### 2.2 Expansão do Schema Prisma

**Ações necessárias**:

- [ ] Criar model `Quiz` no schema Prisma

  - id (String, @id, @default(cuid()))
  - title (String)
  - description (String?)
  - createdAt (DateTime, @default(now()))
  - updatedAt (DateTime, @updatedAt)
  - steps (Step[])
  - responses (Response[])

- [ ] Criar model `Step` no schema Prisma

  - id (String, @id, @default(cuid()))
  - quizId (String)
  - title (String)
  - order (Int)
  - quiz (Quiz, @relation)
  - elements (Element[])

- [ ] Criar model `Element` no schema Prisma

  - id (String, @id, @default(cuid()))
  - stepId (String)
  - type (ElementType - enum)
  - order (Int)
  - content (Json) // Para armazenar propriedades específicas
  - step (Step, @relation)

- [ ] Criar enum `ElementType` no schema Prisma
  - TEXT
  - MULTIPLE_CHOICE
  - NAVIGATION_BUTTON

**Resultado esperado**: Schema completo para suportar a estrutura de Quiz → Steps → Elements.

### 2.3 Criação do Schema para Respostas

**Ações necessárias**:

- [ ] Criar model `Response` no schema Prisma

  - id (String, @id, @default(cuid()))
  - quizId (String)
  - sessionId (String) // Para agrupar respostas de uma sessão
  - createdAt (DateTime, @default(now()))
  - completedAt (DateTime?)
  - quiz (Quiz, @relation)
  - answers (Answer[])

- [ ] Criar model `Answer` no schema Prisma
  - id (String, @id, @default(cuid()))
  - responseId (String)
  - elementId (String)
  - value (Json) // Para diferentes tipos de resposta
  - response (Response, @relation)

**Resultado esperado**: Sistema completo para capturar e armazenar respostas dos usuários.

### 2.4 Geração Automática dos Tipos TypeScript

**Ações necessárias**:

- [ ] Executar `npx prisma generate` para gerar tipos automaticamente
- [ ] Verificar se todos os tipos foram gerados corretamente em `node_modules/.prisma/client`
- [ ] Criar apenas tipos compostos específicos quando necessário para a aplicação

**Tipos compostos necessários** (apenas quando Prisma não oferece):

```typescript
// /src/types/composed.ts
import type { Quiz, Step, Element, Response, Answer } from "@prisma/client";

// Tipos para operações do editor
export type QuizWithSteps = Quiz & {
  steps: (Step & { elements: Element[] })[];
};

// Tipos para resposta completa
export type ResponseWithAnswers = Response & {
  answers: Answer[];
};

// Tipos para criação (sem campos auto-gerados)
export type CreateQuizInput = Omit<Quiz, "id" | "createdAt" | "updatedAt">;
export type CreateStepInput = Omit<Step, "id" | "quizId">;
export type CreateElementInput = Omit<Element, "id" | "stepId">;
```

### 2.5 Execução das Migrations

**Ações necessárias**:

- [ ] Gerar migration do Prisma com as mudanças do schema
- [ ] Executar migration no banco de desenvolvimento
- [ ] Verificar se as tabelas foram criadas corretamente
- [ ] Gerar cliente Prisma atualizado

**Comandos necessários**:

```bash
npx prisma migrate dev --name init-quiz-schema
npx prisma generate
```

### 2.6 Validação da Modelagem

**Ações necessárias**:

- [ ] Criar seeds básicos para testar a estrutura
- [ ] Verificar relacionamentos funcionando corretamente
- [ ] Testar queries básicas (criar quiz, buscar quiz com steps, etc.)
- [ ] Validar performance das queries com relacionamentos

**Resultado esperado**: Estrutura de dados funcional e testada.

## Critérios de Conclusão

A Tarefa 2 estará concluída quando:

- ✅ Schema Prisma completo com todos os models necessários
- ✅ Tipos TypeScript gerados automaticamente pelo Prisma
- ✅ Tipos compostos criados apenas quando necessário
- ✅ Migrations executadas com sucesso
- ✅ Relacionamentos entre entidades funcionando
- ✅ Seeds básicos criados e testados

## Dependências

**Pré-requisitos**:

- Configuração inicial do projeto (Tarefa 1)
- Banco PostgreSQL configurado

**Próximas tarefas que dependem desta**:

- Tarefa 4: Componentes Base UI
- Tarefa 9: API Routes (implementação das operações CRUD)
- Tarefa 10: Persistência de Dados

## Observações Técnicas

1. **Prisma Generate**: Utilizaremos exclusivamente os tipos gerados pelo Prisma para manter sincronização automática entre schema e TypeScript.

2. **Tipos Compostos**: Criar tipos compostos apenas quando necessário para operações específicas (joins, inputs de criação, etc.).

3. **JSON vs Campos Específicos**: O campo `content` em `Element` usa JSON para flexibilidade, permitindo diferentes propriedades por tipo de elemento.

4. **IDs**: Usar `cuid()` ao invés de `autoincrement()` para IDs únicos e seguros para URLs públicas.

5. **Indexação**: Adicionar índices apropriados para performance (quiz.id, step.quizId, element.stepId).

6. **Imports**: Sempre importar tipos do `@prisma/client` ao invés de definições manuais.
