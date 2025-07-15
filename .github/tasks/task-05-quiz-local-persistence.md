# Persistência Local de Quiz

## Contexto

Implementar sistema de salvamento automático e recuperação de estado do quiz no editor, utilizando localStorage para garantir que o trabalho do usuário não seja perdido durante a sessão. Esta funcionalidade é crucial para a experiência do usuário, permitindo continuidade de trabalho mesmo após recarregamento da página ou fechamento acidental do navegador.

## Pré-requisitos

- Store Zustand (`useEditorStore`) implementado e funcional
- Sistema de elementos básicos funcionando (TextElement, MultipleChoiceElement, NavigationButtonElement)
- Sistema de steps implementado
- Interface do editor renderizando corretamente
- Tipos TypeScript definidos em `/src/types/composed.ts`

## Atividades

### 1. Implementar Auto-Save no Editor Store

**Descrição:** Adicionar funcionalidade de salvamento automático ao useEditorStore com debounce para otimizar performance
**Arquivos afetados:**

- `/src/stores/useEditorStore.ts`
- `/src/hooks/useAutoSave.ts` (novo)

**Critérios de aceite:**

- [ ] Quiz é salvo automaticamente a cada mudança com debounce de 500ms
- [ ] Salvamento inclui todos os dados: steps, elements, configurações
- [ ] Sistema detecta mudanças apenas quando necessário (não salva se dados iguais)
- [ ] Loading state durante salvamento é gerenciado
- [ ] Tratamento de erros do localStorage (quota excedida)

### 2. Implementar Recuperação de Estado

**Descrição:** Adicionar sistema de carregamento automático do quiz salvo ao inicializar o editor
**Arquivos afetados:**

- `/src/stores/useEditorStore.ts`
- `/src/app/editor/page.tsx`
- `/src/hooks/useQuizRecovery.ts` (novo)

**Critérios de aceite:**

- [ ] Quiz salvo é carregado automaticamente ao abrir o editor
- [ ] Estado completo é restaurado: step atual, elementos selecionados
- [ ] Fallback para quiz vazio se dados corrompidos ou inexistentes
- [ ] Loading state durante carregamento inicial
- [ ] Validação de integridade dos dados antes de restaurar

### 3. Sistema de Export/Import de Quiz

**Descrição:** Criar funcionalidade para exportar/importar configuração do quiz em formato JSON
**Arquivos afetados:**

- `/src/lib/quiz-export.ts` (novo)
- `/src/lib/quiz-import.ts` (novo)
- `/src/components/editor/ExportImportDialog.tsx` (novo)
- `/src/stores/useEditorStore.ts`

**Critérios de aceite:**

- [ ] Botão de export gera arquivo JSON com todo o quiz
- [ ] Botão de import permite carregar arquivo JSON válido
- [ ] Validação rigorosa do arquivo importado (schema validation)
- [ ] Confirmação antes de sobrescrever quiz atual
- [ ] Tratamento de erros para arquivos inválidos ou corrompidos
- [ ] Export inclui metadados: versão, timestamp, etc.

### 4. Validação e Integridade de Dados

**Descrição:** Implementar sistema robusto de validação para dados salvos/carregados
**Arquivos afetados:**

- `/src/lib/quiz-validation.ts` (novo)
- `/src/schemas/quiz-schema.ts` (novo)
- `/src/stores/useEditorStore.ts`

**Critérios de aceite:**

- [ ] Schema Zod para validação completa da estrutura do quiz
- [ ] Validação de elementos: tipos, propriedades obrigatórias
- [ ] Validação de steps: ordem, referências válidas
- [ ] Migration automática para versões antigas do formato
- [ ] Logs detalhados para debugging de problemas de validação
- [ ] Fallback gracioso para dados parcialmente corrompidos

### 5. Interface de Gerenciamento de Persistência

**Descrição:** Criar componentes UI para controle manual do sistema de persistência
**Arquivos afetados:**

- `/src/components/editor/SaveStatus.tsx` (novo)
- `/src/components/editor/EditorHeader.tsx`
- `/src/components/ui/SaveIndicator.tsx` (novo)

**Critérios de aceite:**

- [ ] Indicador visual de status de salvamento (salvo, salvando, erro)
- [ ] Botão manual "Salvar Agora" para salvamento imediato
- [ ] Botão "Limpar Quiz" com confirmação para reset completo
- [ ] Timestamp da última alteração visível
- [ ] Notificação toast para confirmação de ações
- [ ] Atalho de teclado Ctrl+S para salvamento manual

### 6. Otimização de Performance e Storage

**Descrição:** Implementar otimizações para minimizar uso de localStorage e melhorar performance
**Arquivos afetados:**

- `/src/lib/storage-manager.ts` (novo)
- `/src/hooks/useStorageQuota.ts` (novo)
- `/src/stores/useEditorStore.ts`

**Critérios de aceite:**

- [ ] Compressão de dados antes de salvar no localStorage
- [ ] Limpeza automática de versões antigas (manter apenas últimas 5)
- [ ] Monitoramento de quota do localStorage
- [ ] Warning quando quota próxima do limite
- [ ] Estratégia de fallback quando storage indisponível
- [ ] Debounce configurável para auto-save

## Validação

### Testes Funcionais

- [ ] Criar quiz, recarregar página, verificar se estado foi restaurado
- [ ] Modificar elemento, aguardar auto-save, verificar indicador visual
- [ ] Exportar quiz, importar em nova sessão, verificar integridade
- [ ] Simular localStorage cheio, verificar tratamento de erro
- [ ] Importar arquivo JSON inválido, verificar validação

### Testes de Performance

- [ ] Auto-save não impacta responsividade da interface
- [ ] Carregamento inicial < 500ms mesmo com quiz complexo
- [ ] Debounce funciona corretamente (não salva a cada tecla)

### Testes de Robustez

- [ ] Sistema funciona com localStorage desabilitado
- [ ] Recuperação de dados corrompidos não quebra aplicação
- [ ] Import de arquivos grandes (>1MB) é tratado adequadamente

## Observações Técnicas

### Padrões do Projeto

- Usar Zustand middleware para persistência automática
- Seguir padrão de tipos TypeScript definido em `/src/types/composed.ts`
- Usar Shadcn/ui para todos os componentes de interface
- Implementar loading states consistentes com o design system

### Considerações de Storage

- localStorage tem limite ~5-10MB por domínio
- Usar compressão (LZ-string) para otimizar espaço
- Considerar IndexedDB para storage futuro se necessário

### Versionamento de Dados

- Incluir campo `version` nos dados salvos
- Implementar migrations para mudanças futuras na estrutura
- Manter compatibilidade com versões anteriores quando possível

### Error Handling

- Nunca quebrar aplicação por falhas de storage
- Logs detalhados para debugging em desenvolvimento
- Fallbacks gracioso para todas as operações de I/O

### Security

- Não salvar dados sensíveis no localStorage
- Validar rigorosamente dados importados
- Sanitizar dados antes de persistir
