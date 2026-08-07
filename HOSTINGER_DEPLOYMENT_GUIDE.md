# 🚀 Guia Completo de Deploy no Hostinger - N' Tandinho Transportes S.A.

Este guia contém as instruções passo-a-passo para colocar no ar o **Website Público**, o **Painel ERP Admin** e o **Backend Node.js API** com **Base de Dados (MySQL ou SQLite)** na **Hostinger** (Alojamento Web Shared / Cloud / VPS).

---

## 📁 Estrutura do Projeto para Deploy

| Componente | Diretório Local | Destino na Hostinger |
| :--- | :--- | :--- |
| **Website Público** | Raiz (`index.html`, `assets/`, `.htaccess`) | `public_html/` |
| **Painel ERP Admin** | `admin/dist/` | `public_html/admin/` |
| **API Backend Node.js** | `api/` (`dist/`, `app.js`, `package.json`, `prisma/`) | Subpasta `api/` ou aplicação Node.js independente |

---

## 🛠️ OPÇÃO 1: Hostinger Web Hosting (hPanel / Node.js Web App)

### 1. Preparar a Base de Dados na Hostinger (MySQL)
1. Acesse o painel da Hostinger (**hPanel**) ➔ **Bases de dados MySQL**.
2. Crie uma nova base de dados:
   - **Nome da BD:** `u123456789_ntandinho`
   - **Utilizador:** `u123456789_user`
   - **Palavra-passe:** `SuaSenhaSegura2026!`
3. Anote a string de conexão:
   ```env
   DATABASE_URL="mysql://u123456789_user:SuaSenhaSegura2026!@localhost:3306/u123456789_ntandinho"
   ```

> 💡 *Nota: Se preferir usar SQLite (sem configurar MySQL), a aplicação usará automaticamente o ficheiro `prod.db` criado no backend.*

---

### 2. Configurar a Aplicação Node.js na Hostinger
1. No **hPanel**, navegue até **Aplicações Web ➔ Node.js**.
2. Clique em **Criar Aplicação Node.js**:
   - **Versão do Node.js:** `20.x` ou `18.x`
   - **Modo da Aplicação:** `Production`
   - **Raiz da Aplicação:** `public_html/api` (ou `/api`)
   - **URL da Aplicação:** `seu-dominio.co.mz/api` (ou porta atribuída)
   - **Ficheiro de Entrada:** `app.js` (ou `dist/server.js`)
3. Adicione as Variáveis de Ambiente no painel ou crie o ficheiro `.env` dentro da pasta `api`:
   ```env
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=sua_chave_jwt_secreta_prod_2026
   JWT_REFRESH_SECRET=sua_chave_jwt_refresh_secreta_prod_2026
   DATABASE_URL="mysql://u123456789_user:SuaSenhaSegura2026!@localhost:3306/u123456789_ntandinho"
   ```

---

### 3. Fazer Upload dos Ficheiros via FTP / File Manager

1. **Website Público (`public_html/`):**
   - Envie todos os ficheiros da raiz local (`index.html`, `assets/`, `.htaccess`, `robots.txt`, `sitemap.xml`, `uploads/`) para a pasta `public_html/` na Hostinger.

2. **Painel Admin ERP (`public_html/admin/`):**
   - Certifique-se de que compilou o admin localmente executando `npm run build` na pasta `admin/`.
   - Crie a pasta `admin` dentro de `public_html/` na Hostinger.
   - Copie o **conteúdo** da pasta local `admin/dist/` (incluindo `index.html`, `assets/` e `.htaccess`) para `public_html/admin/`.

3. **Backend API (`public_html/api/`):**
   - Certifique-se de que compilou a API localmente executando `npm run build` na pasta `api/`.
   - Envie para a pasta `public_html/api/`:
     - Pasta `dist/`
     - Pasta `prisma/`
     - Ficheiro `app.js`
     - Ficheiro `package.json`
     - Ficheiro `.env` (configurado com as credenciais de produção)

---

### 4. Instalar Dependências e Inicializar a Base de Dados

No terminal SSH da Hostinger (ou usando o Terminal integrado do hPanel):
```bash
cd public_html/api

# 1. Instalar dependências de produção
npm install --production

# 2. Gerar cliente do Prisma
npx prisma generate

# 3. Aplicar esquema na base de dados
npx prisma db push

# 4. Semear a base de dados com o administrador inicial e dados do ERP
npm run seed
```

---

## 💻 OPÇÃO 2: Hostinger VPS (Ubuntu 22.04 / Nginx / PM2)

Se estiver a utilizar um **VPS na Hostinger**:

### 1. Instalar Nginx, Node.js e PM2
```bash
sudo apt update && sudo apt install -y nginx nodejs npm mysql-server
sudo npm install -g pm2
```

### 2. Configurar o Nginx (`/etc/nginx/sites-available/default`)
```nginx
server {
    listen 80;
    server_name seu-dominio.co.mz www.seu-dominio.co.mz;

    root /var/www/ntandinho;
    index index.html;

    # Site Público
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Painel Admin ERP (/admin)
    location /admin {
        alias /var/www/ntandinho/admin;
        try_files $uri $uri/ /admin/index.html;
    }

    # API Backend (/api)
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Servir Ficheiros de Upload
    location /uploads {
        alias /var/www/ntandinho/uploads;
    }
}
```

### 3. Iniciar o Servidor API com PM2
```bash
cd /var/www/ntandinho/api
pm2 start dist/server.js --name "ntandinho-api"
pm2 save
pm2 startup
```

---

## 🔑 Credenciais de Acesso de Produção (Iniciais)

Após concluir a semeação da base de dados (`npm run seed`):

- **URL do Site Público:** `https://seu-dominio.co.mz/`
- **URL do Painel Admin:** `https://seu-dominio.co.mz/admin`
- **Utilizador Administrador:** `admin@ntandinho.co.mz`
- **Palavra-passe Padrão:** `Admin2026!`

---

## 🛡️ Checklist de Verificação Pós-Deploy

- [x] Compilação do Admin React concluída sem erros (`npm run build` na pasta `/admin`)
- [x] Compilação da API TypeScript e geração Prisma concluídas (`npm run build` na pasta `/api`)
- [x] Ficheiro `.htaccess` configurado com regras de reescrita SPA e HTTPS
- [x] Ficheiro `api/app.js` configurado para compatibilidade com o seletor Node.js do Hostinger
- [x] Ficheiro de exemplo `.env.production.example` criado
- [x] Esquemas Prisma preparados para MySQL (`schema.mysql.prisma`) e SQLite (`schema.prisma`)
- [x] Script de semeação inicial de base de dados testado e funcional (`npm run seed`)
