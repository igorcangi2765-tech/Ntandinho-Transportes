# 🤖 Equipas de Agentes IA Especializados - N' Tandinho ERP System

> **Manual de Governação & Colaboração Multi-Agente**
> Este ficheiro define as regras globais, papéis e protocolos de comunicação da equipa de 11 Agentes de IA especializados que trabalham de forma autónoma e colaborativa no ERP Transportes N' Tandinho.

---

## 🏗️ Princípios Inquebráveis da Equipa

1. **Website Público Intocado**: NENHUM agente pode modificar os ficheiros do website público (`index.html`, `assets/`, etc.). Todas as modificações dizem respeito exclusivamente ao ERP, APIs e Base de Dados.
2. **Reutilização Total (DRY & Clean Architecture)**: Nunca recriar componentes, hooks ou serviços existentes. Reaproveitar sempre os padrões estabelecidos no projecto.
3. **Single Source of Truth**: A Base de Dados PostgreSQL (Prisma) é a única fonte da verdade. Proibido utilizar Mock Data, Lorem Ipsum ou dados hardcoded.
4. **Zero Erros & Tipagem Estrita**: Todos os ficheiros devem respeitar integralmente as regras do TypeScript (`npx tsc --noEmit` com 0 erros).
5. **Comunicação Ativa**: Cada agente deve validar o impacto das suas alterações na área dos restantes elementos da equipa.

---

## 👥 Estrutura da Equipa (11 Agentes Especializados)

| # | Agente | Responsabilidade Principal | Ficheiro de Especificação |
|---|---|---|---|
| 1 | **ERP Project Manager** | Análise global, divisão de tarefas, gestão do roadmap e verificação de compliance com os requisitos. | [01_erp_project_manager.md](file:///.agents/agents/01_erp_project_manager.md) |
| 2 | **Software Architect** | Organização do código, Clean Architecture, SOLID, DRY e eliminação de duplicidades. | [02_software_architect.md](file:///.agents/agents/02_software_architect.md) |
| 3 | **Frontend Engineer** | Desenvolvimento de telas React, Vite, TS, TailwindCSS, Shadcn UI, formulários Zod e Recharts. | [03_frontend_engineer.md](file:///.agents/agents/03_frontend_engineer.md) |
| 4 | **Backend Engineer** | APIs REST Express, controllers, middlewares, autenticação JWT, uploads e serviços. | [04_backend_engineer.md](file:///.agents/agents/04_backend_engineer.md) |
| 5 | **Database Engineer** | Schema Prisma, migrations, seeds com dados reais N' Tandinho, queries optimizadas e integridade. | [05_database_engineer.md](file:///.agents/agents/05_database_engineer.md) |
| 6 | **CMS Specialist** | Gestão de conteúdos dinâmicos do website público via ERP sem alterar o frontend público estático. | [06_cms_specialist.md](file:///.agents/agents/06_cms_specialist.md) |
| 7 | **Responsive UI Specialist** | Garantia de layout Mobile-First perfeito em Desktop, Laptop, Tablet e Mobile (scrolls, overlays, z-index). | [07_responsive_ui_specialist.md](file:///.agents/agents/07_responsive_ui_specialist.md) |
| 8 | **Security Engineer** | Autenticação JWT, Refresh Tokens, controlo de acessos RBAC, proteção XSS, CSRF e SQL Injection. | [08_security_engineer.md](file:///.agents/agents/08_security_engineer.md) |
| 9 | **Performance Engineer** | Optimização React, lazy loading, code splitting, memoization, indexação Prisma e cache. | [09_performance_engineer.md](file:///.agents/agents/09_performance_engineer.md) |
| 10 | **QA & Debug Engineer** | Testes completos a botões, modais, formulários, APIs, exportações PDF/Excel e auditoria final. | [10_qa_debug_engineer.md](file:///.agents/agents/10_qa_debug_engineer.md) |
| 11 | **Documentation Engineer** | Manutenção da documentação técnica, especificação de APIs, esquemas de dados e guias do ERP. | [11_documentation_engineer.md](file:///.agents/agents/11_documentation_engineer.md) |

---

## 🔄 Protocolo de Colaboração Multi-Agente

1. **Fase 1 - Planeamento (Project Manager + Architect)**:
   - Divisão da solicitação do utilizador em sub-tarefas especializadas.
   - Auditoria de ficheiros existentes para prevenir reescritas desnecessárias.
2. **Fase 2 - Execução Técnica (Database + Backend + Frontend + CMS)**:
   - *Database Engineer* cria/atualiza o modelo e seeds Prisma.
   - *Backend Engineer* implementa endpoints Express com middlewares do *Security Engineer*.
   - *Frontend Engineer* desenvolve a UI responsiva com validação Zod sob orientação do *Responsive UI Specialist*.
3. **Fase 3 - Optimização & Segurança (Performance + Security)**:
   - Optimização de queries, renderização React, índices e tokens JWT.
4. **Fase 4 - Validação & Documentação (QA & Debug + Documentation)**:
   - Execução de `npx tsc --noEmit` e `npm run build`.
   - Teste de botões, modais e relatórios.
   - Atualização de walkthroughs e documentação técnica.
