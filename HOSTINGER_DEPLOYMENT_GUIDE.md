# 🚀 Guia Completo de Deploy na Hostinger (PHP 8.3 API + React SPA) - N' Tandinho Transportes S.A.

Este guia detalha o processo automatizado de preparação e envio para produção do **Website Público**, do **Painel ERP Admin React** e da **API Backend PHP 8.3 Nativa** nos URLs:
- **Website Público:** `https://ntandinho.zyphtech.com/`
- **Painel Admin ERP:** `https://ntandinho.zyphtech.com/admin/login`
- **API Backend PHP 8.3:** `https://ntandinho.zyphtech.com/api/`
- **API Health Check:** `https://ntandinho.zyphtech.com/api/health`

---

## ⚡ 1-Clique: Comando de Preparação Automática de Deploy

No terminal da raiz do projeto local, execute:

```bash
npm run deploy:prepare
```

Este comando executa automaticamente:
1. Compilação TypeScript + Vite do Frontend Admin (`admin/dist`).
2. Empacotamento automático da API PHP 8.3 Nativa (`api/`).
3. Geração automática da pasta `dist_production/public_html` pronta para a Hostinger!

---

## 📁 Estrutura da Pasta `dist_production/public_html`

| Componente Local | Destino na Hostinger | Função |
| :--- | :--- | :--- |
| `dist_production/public_html/` | `public_html/` | Ficheiros do Site Público (`index.html`, `assets/`, `.htaccess`) |
| `dist_production/public_html/admin/` | `public_html/admin/` | Ficheiros compilados do Painel ERP Admin React SPA |
| `dist_production/public_html/api/` | `public_html/api/` | Backend API PHP 8.3 Nativo (PDO + MySQL) |

---

## 🛠️ Deploy na Hostinger Web Hosting (PHP 8.3 + Apache / LiteSpeed)

### 1. Base de Dados MySQL na Hostinger
1. No **hPanel**, aceda a **Bases de Dados MySQL**.
2. A sua base de dados já se encontra criada com as seguintes credenciais:
   - **Nome da BD:** `u178468876_u178468876_Dts`
   - **Utilizador:** `u178468876_u178468876_log`
   - **Palavra-passe:** `[A palavra-passe definida por si no hPanel]`
3. Se necessário, importe o ficheiro SQL inicial:
   - Abra o **phpMyAdmin** na Hostinger.
   - Selecione a base de dados `u178468876_u178468876_Dts` e vá ao separador **Importar**.
   - Escolha o ficheiro `ntandinho_hostinger_database.sql` (disponível dentro da pasta `dist_production/public_html/api/`).
   - Clique em **Executar**.

---

### 2. Enviar os Ficheiros para a Hostinger (File Manager / FTP)
1. Abra o **Gerenciador de Arquivos (File Manager)** no **hPanel** da Hostinger.
2. Navegue até à pasta `public_html/`.
3. Envie todo o **conteúdo** que se encontra dentro da pasta local `dist_production/public_html/` para a pasta `public_html/` do servidor.
4. Confirme a estrutura no servidor:
   - `public_html/index.html`
   - `public_html/.htaccess`
   - `public_html/admin/index.html`
   - `public_html/admin/.htaccess`
   - `public_html/api/index.php`
   - `public_html/api/.htaccess`
   - `public_html/api/config/database.php`

---

## 🔑 Credenciais de Acesso de Produção

Após o deploy:

- **Site Público:** [https://ntandinho.zyphtech.com/](https://ntandinho.zyphtech.com/)
- **Painel Admin ERP:** [https://ntandinho.zyphtech.com/admin/login](https://ntandinho.zyphtech.com/admin/login)
- **API Health:** [https://ntandinho.zyphtech.com/api/health](https://ntandinho.zyphtech.com/api/health)
- **Utilizador Administrador:** `admin@ntandinho.co.mz`
- **Palavra-passe Padrão:** `Admin2026!`

---

## 🛡️ Checklist de Deploy Concluído

- [x] Backend migrado de Node.js para PHP 8.3 Nativo + PDO.
- [x] Script `npm run deploy:prepare` atualizado e funcional.
- [x] Respostas exclusivamente em JSON para todos os endpoints `/api/*`.
- [x] Autenticação nativa via `password_verify()` com hashes bcrypt mantidos.
- [x] Regras `.htaccess` prontas para SPA (`/admin/login`) e roteamento PHP (`/api`).
