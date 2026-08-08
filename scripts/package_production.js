const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distProdDir = path.resolve(rootDir, 'dist_production');
const publicHtmlDir = path.resolve(distProdDir, 'public_html');
const adminDestDir = path.resolve(publicHtmlDir, 'admin');
const apiDestDir = path.resolve(publicHtmlDir, 'api');

function copyRecursive(src, dest, ignoreList = []) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (ignoreList.includes(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry), ignoreList);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function buildProductionPackage() {
  console.log('📦 A iniciar o empacotamento para a Hostinger...');

  // 1. Limpar diretório dist_production anterior se existir
  if (fs.existsSync(distProdDir)) {
    console.log('🧹 A limpar a pasta dist_production antiga...');
    fs.rmSync(distProdDir, { recursive: true, force: true });
  }

  fs.mkdirSync(publicHtmlDir, { recursive: true });
  fs.mkdirSync(adminDestDir, { recursive: true });
  fs.mkdirSync(apiDestDir, { recursive: true });

  // 2. Copiar Website Público (raiz) para public_html
  console.log('🌐 A copiar Website Público para public_html...');
  const rootFilesToCopy = [
    'index.html',
    'assets',
    'uploads',
    'og-transportes-ntandinho.jpeg',
    'robots.txt',
    'sitemap.xml',
    '.htaccess',
  ];

  for (const item of rootFilesToCopy) {
    const srcPath = path.resolve(rootDir, item);
    const destPath = path.resolve(publicHtmlDir, item);
    if (fs.existsSync(srcPath)) {
      copyRecursive(srcPath, destPath);
      console.log(`  ✓ ${item}`);
    }
  }

  // 3. Copiar Admin (admin/dist) para public_html/admin
  console.log('🖥️  A copiar Painel ERP Admin (admin/dist) para public_html/admin...');
  const adminDistSrc = path.resolve(rootDir, 'admin/dist');
  if (fs.existsSync(adminDistSrc)) {
    copyRecursive(adminDistSrc, adminDestDir);
    console.log('  ✓ admin/dist -> public_html/admin');
  } else {
    console.warn('  ⚠️ Aviso: admin/dist não encontrado!');
  }

  // Garantir que .htaccess do admin existe em public_html/admin
  const adminHtaccessSrc = path.resolve(rootDir, 'admin/public/.htaccess');
  const adminHtaccessDest = path.resolve(adminDestDir, '.htaccess');
  if (fs.existsSync(adminHtaccessSrc)) {
    fs.copyFileSync(adminHtaccessSrc, adminHtaccessDest);
    console.log('  ✓ admin/public/.htaccess -> public_html/admin/.htaccess');
  }

  // 4. Copiar Backend API (api) para public_html/api
  console.log('🔒 A copiar Backend API Node.js para public_html/api...');
  const apiItemsToCopy = [
    'app.js',
    'package.json',
    '.env.production.example',
    'ntandinho_hostinger_database.sql',
    'dist',
    'prisma',
  ];

  for (const item of apiItemsToCopy) {
    const srcPath = path.resolve(rootDir, 'api', item);
    const destPath = path.resolve(apiDestDir, item);
    if (fs.existsSync(srcPath)) {
      copyRecursive(srcPath, destPath, ['dev.db', 'prod.db']);
      console.log(`  ✓ api/${item}`);
    }
  }

  // Criar um .env inicial em public_html/api com modelo de produção
  const envProdSrc = path.resolve(rootDir, 'api/.env.production.example');
  const envProdDest = path.resolve(apiDestDir, '.env');
  if (fs.existsSync(envProdSrc)) {
    fs.copyFileSync(envProdSrc, envProdDest);
    console.log('  ✓ api/.env.production.example -> public_html/api/.env');
  }

  console.log('\n==================================================');
  console.log('✅ PACOTE DE PRODUÇÃO ESTRUTURADO COM SUCESSO!');
  console.log(`📁 Pasta Gerada: ${distProdDir}`);
  console.log('👉 Carregue o conteúdo de dist_production/public_html para o public_html da Hostinger.');
  console.log('==================================================\n');
}

buildProductionPackage();
