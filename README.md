# 🚛 Transportes N' Tandinho S.A. — N' Tandinho ERP

> **Sistema Integrado de Gestão Empresarial, Frota, Operações & Logística**  
> **Identidade Oficial:** Transportes N' Tandinho S.A. | **Produto:** N' Tandinho ERP  
> **Área:** Transporte Rodoviário de Cargas & Logística em Moçambique e Região SADC.

---

## 📁 Arquitetura do Projeto

```text
/
├── website/            # Website público institucional (HTML5, TailwindCSS, JS Vanilla)
├── admin/              # Frontend Admin N' Tandinho ERP (Vite, React, TypeScript, TailwindCSS, Zustand)
├── api/                # API Backend RESTful (Node.js, Express, TypeScript, Prisma ORM, JWT)
├── prisma/             # Schema relacional PostgreSQL, migrações e seeds oficiais
├── scripts/            # Scripts utilitários de empacotamento para produção
├── .env.example        # Modelo global de variáveis de ambiente
├── package.json        # Manifest com scripts unificados de build e desenvolvimento
└── README.md           # Guia técnico e procedimentos de deploy na Hostinger
```

---

## 🛠️ Requisitos de Ambiente

- **Node.js**: v18.x ou v20.x LTS
- **Gestor de Pacotes**: `npm` v9+
- **Base de Dados**: PostgreSQL 14+ / Supabase / Hostinger PostgreSQL Database
- **Servidor Web**: Hostinger hPanel / Nginx / Apache (.htaccess incluído)

---

## 🚀 Instalação e Execução Local

1. **Clonar o Repositório & Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar Variáveis de Ambiente**:
   - Copie `.env.example` para `.env` na raiz e em `api/` e `admin/`:
   ```bash
   cp .env.example .env
   cp admin/.env.example admin/.env
   ```

3. **Inicializar a Base de Dados (Prisma)**:
   ```bash
   npm run seed
   ```

4. **Executar em Modo de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   - **ERP Admin**: `http://localhost:3000/`
   - **API Backend**: `http://localhost:5000/`

---

## 📦 Compilação de Produção

Para gerar os pacotes de produção do frontend e da API:

```bash
npm run build
```

Os ficheiros estáticos optimizados serão gerados em `admin/dist` e a API em `api/dist`.

---

## 🌐 Guia de Deploy na Hostinger (hPanel)

### 1. Frontend ERP Admin (`admin/dist`)
- No painel da Hostinger (hPanel), navegue para **Gerenciador de Arquivos** no seu domínio ou subdomínio (ex.: `admin.ntandinho.co.mz`).
- Copie o conteúdo da pasta `admin/dist/` para o diretório `public_html/`.
- O ficheiro `.htaccess` configurado garante o roteamento SPA do React Router.

### 2. API Backend Node.js (`api/`)
- Aceda a **Node.js Apps** no hPanel da Hostinger.
- Defina o ponto de entrada como `api/dist/server.js` ou `api/app.js`.
- Adicione as variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`) no painel da Hostinger.

### 3. Base de Dados PostgreSQL
- Crie uma base de dados PostgreSQL no hPanel.
- Execute `npx prisma db push` para aplicar a estrutura das tabelas e o seed inicial.

---

## 🔒 Segurança & Boas Práticas
- NUNCA suba ficheiros `.env` reais ou credenciais de base de dados para o Git.
- Todos os endpoints de mutação da API utilizam autenticação JWT e validação Zod.
