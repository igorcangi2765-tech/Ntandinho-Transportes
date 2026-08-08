# 🚀 Guia Completo de Deploy no Hostinger - N' Tandinho Transportes S.A.

Este guia detalha o processo automatizado de preparação e envio para produção do **Website Público** e do **Painel ERP Admin** nos URLs:
- **Website Público:** `https://ntandinho.zyphtech.com/`
- **Painel Admin ERP:** `https://ntandinho.zyphtech.com/admin/login`
- **API Backend Node.js:** `https://ntandinho.zyphtech.com/api/`

---

## ⚡ 1-Clique: Comando de Preparação Automática de Deploy

No terminal da raiz do projeto local, execute:

```bash
npm run deploy:prepare
```

Este comando executa automaticamente:
1. Compilação TypeScript do Backend (`api/dist`) e geração do cliente Prisma.
2. Compilação TypeScript + Vite do Frontend Admin (`admin/dist`).
3. Geração automática da pasta `dist_production/public_html` pronta para o Hostinger!

---

## 📁 Estrutura da Pasta `dist_production/public_html`

| Componente Local | Destino na Hostinger | Função |
| :--- | :--- | :--- |
| `dist_production/public_html/` | `public_html/` | Ficheiros do Site Público (`index.html`, `assets/`, `.htaccess`) |
| `dist_production/public_html/admin/` | `public_html/admin/` | Ficheiros compilados do Painel ERP Admin React SPA |
| `dist_production/public_html/api/` | `public_html/api/` (ou `/api`) | Aplicação Node.js Backend com Prisma & MySQL/SQLite |

---

## 🛠️ OPÇÃO 1: Hostinger Web Hosting (hPanel / Node.js Web App) - RECOMENDADO

### 1. Criar Base de Dados MySQL na Hostinger
1. No **hPanel**, aceda a **Bases de Dados MySQL**.
2. Crie uma nova base de dados:
   - **Nome da BD:** `u123456789_ntandinho`
   - **Utilizador:** `u123456789_user`
   - **Palavra-passe:** `SuaSenhaSegura2026!`
3. Importe o ficheiro SQL de dados iniciais:
   - Abra o **phpMyAdmin** na Hostinger.
   - Selecione a base de dados criada e vá ao separador **Importar**.
   - Escolha o ficheiro `ntandinho_hostinger_database.sql` (disponível dentro da pasta `dist_production/public_html/api/`).
   - Clique em **Executar**.

---

### 2. Configurar a Aplicação Node.js no hPanel
1. No **hPanel**, navegue até **Aplicações Web ➔ Node.js**.
2. Clique em **Criar Aplicação Node.js**:
   - **Versão do Node.js:** `20.x` ou `18.x`
   - **Modo da Aplicação:** `Production`
   - **Raiz da Aplicação:** `public_html/api`
   - **URL da Aplicação:** `ntandinho.zyphtech.com/api`
   - **Ficheiro de Entrada:** `app.js`
3. Configure as Variáveis de Ambiente no ficheiro `public_html/api/.env`:
   ```env
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=sua_chave_jwt_secreta_prod_2026
   JWT_REFRESH_SECRET=sua_chave_jwt_refresh_secreta_prod_2026
   DATABASE_URL="mysql://u123456789_user:SuaSenhaSegura2026!@localhost:3306/u123456789_ntandinho"
   ```

---

### 3. Enviar os Ficheiros para a Hostinger (File Manager / FTP)
1. Abra o **Gerenciador de Arquivos (File Manager)** no **hPanel** da Hostinger.
2. Navegue até à pasta `public_html/`.
3. Envie todo o **conteúdo** que se encontra dentro da pasta local `dist_production/public_html/` para a pasta `public_html/` do servidor.
4. Confirme que a estrutura no servidor ficou:
   - `public_html/index.html`
   - `public_html/.htaccess`
   - `public_html/admin/index.html`
   - `public_html/admin/.htaccess`
   - `public_html/api/app.js`

---

### 4. Instalar Dependências no Terminal da Hostinger
No SSH da Hostinger ou Terminal do hPanel:
```bash
cd public_html/api

# 1. Instalar dependências de produção
npm install --production

# 2. Gerar Prisma Client
npx prisma generate
```

---

## 🔑 Credenciais de Acesso de Produção

Após a importação do ficheiro SQL ou execução do seed:

- **Site Público:** [https://ntandinho.zyphtech.com/](https://ntandinho.zyphtech.com/)
- **Painel Admin ERP:** [https://ntandinho.zyphtech.com/admin/login](https://ntandinho.zyphtech.com/admin/login)
- **Utilizador Administrador:** `admin@ntandinho.co.mz`
- **Palavra-passe Padrão:** `Admin2026!`

---

## 🛡️ Checklist de Deploy Concluído

- [x] Script `npm run deploy:prepare` criado e funcional.
- [x] Geração automática da pasta `dist_production/public_html`.
- [x] Ficheiro DDL/Seed `ntandinho_hostinger_database.sql` incluído no pacote da API.
- [x] Regras `.htaccess` prontas para SPA (`/admin/login`) e proxy de API (`/api`).
- [x] Suporte para MySQL e SQLite no Prisma.
