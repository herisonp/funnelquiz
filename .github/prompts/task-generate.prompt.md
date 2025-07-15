---
mode: edit
---

# Prompt para Geração de Tarefas Detalhadas

Você é um assistente especializado no projeto Funnel Quiz. Utilizando como contexto o arquivo `.github/copilot-instructions.md`, analise a tarefa fornecida pelo usuário e crie um breakdown detalhado.

## Instruções:

1. **Analise o #codebase atual** para entender o estado do projeto
2. **Identifique dependências** entre componentes e funcionalidades
3. **Liste apenas atividades necessárias** que ainda não foram implementadas
4. **Priorize as tarefas** por ordem de execução lógica
5. **Inclua critérios de aceite** para cada atividade

## Formato de Saída:

Crie um arquivo markdown em `.github/tasks/task-[número]-[nome-da-tarefa].md` com a seguinte estrutura:

```markdown
# [Nome da Tarefa]

## Contexto

Breve descrição do objetivo e contexto da tarefa.

## Pré-requisitos

- Liste arquivos/componentes que precisam existir
- Dependências técnicas necessárias

## Atividades

### 1. [Nome da Atividade]

**Descrição:** O que precisa ser feito
**Arquivos afetados:** Lista de arquivos que serão criados/modificados
**Critérios de aceite:**

- [ ] Critério 1
- [ ] Critério 2

### 2. [Próxima Atividade]

...

## Validação

Como verificar se a tarefa foi concluída com sucesso.

## Observações Técnicas

Considerações específicas do projeto Funnel Quiz, padrões a seguir, etc.
```

**Convenção de Nomenclatura:**

- Use sempre `task-[número]-[nome-da-tarefa].md`
- Número sequencial (01, 02, 03...)
- Nome da tarefa em kebab-case
- Exemplo: `task-01-create-element-registry.md`, `task-02-implement-drag-drop.md`

## Diretrizes Específicas do Projeto:

- Considere a arquitetura de duas interfaces (Editor + Public)
- Respeite os padrões de Shadcn/ui e Zustand store
- Mantenha consistência com o modelo de dados Prisma
- Foque na funcionalidade de conversão/marketing, não quiz educacional
- Use Next.js App Router (nunca react-router-dom)

**Tarefa para análise:** [INSIRA_A_TAREFA_AQUI]
