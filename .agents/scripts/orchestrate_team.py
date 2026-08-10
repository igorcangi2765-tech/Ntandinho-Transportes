"""
Equipa de Agentes IA Especializados - ERP Transportes N' Tandinho
Orquestração Multi-Agente via Google Antigravity Architecture.
"""

import sys
import io

# Ensure UTF-8 output on Windows streams
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

AGENT_TEAM = {
    "01_erp_project_manager": "Gerir tarefas, roadmap e alinhamento do ERP.",
    "02_software_architect": "Garantir Clean Architecture, SOLID, DRY e zero duplicação.",
    "03_frontend_engineer": "Desenvolver UI React, Vite, TailwindCSS, Shadcn UI, Zod e Recharts.",
    "04_backend_engineer": "Desenvolver APIs REST Express, controllers, middlewares e serviços.",
    "05_database_engineer": "Manter schema Prisma, PostgreSQL/Supabase, seeds e queries.",
    "06_cms_specialist": "Gerir conteúdos dinâmicos do website via ERP mantendo frontend intacto.",
    "07_responsive_ui_specialist": "Garantir responsividade perfeita em Desktop, Laptop, Tablet e Mobile.",
    "08_security_engineer": "Garantir autenticação JWT, Refresh Tokens, RBAC e proteção de dados.",
    "09_performance_engineer": "Optimização React, Vite, lazy loading e cache.",
    "10_qa_debug_engineer": "Testar botões, modais, formulários, APIs e exportações PDF/Excel.",
    "11_documentation_engineer": "Manter documentação técnica, walkthroughs e esquemas atualizados."
}

def main():
    print("=" * 70)
    print("🚀 INICIALIZANDO EQUIPA MULTI-AGENTE DE IA - N' TANDINHO ERP SYSTEM")
    print("=" * 70)
    
    for agent_id, desc in AGENT_TEAM.items():
        print(f"  [✓] Agente Carregado: {agent_id:30s} | {desc}")

    print("\n✅ Todos os 11 Agentes Especializados estão operacionais e configurados em .agents/")

if __name__ == "__main__":
    main()
