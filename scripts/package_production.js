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

function calculateDirectorySize(dirPath) {
  let totalSize = 0;
  if (!fs.existsSync(dirPath)) return 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      totalSize += calculateDirectorySize(fullPath);
    } else if (entry.isFile()) {
      totalSize += fs.statSync(fullPath).size;
    }
  }
  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function printDirectoryTree(dirPath, prefix = '') {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const marker = isLast ? '└── ' : '├── ';
    console.log(`${prefix}${marker}${entry.name}${entry.isDirectory() ? '/' : ''}`);
    if (entry.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      printDirectoryTree(path.join(dirPath, entry.name), newPrefix);
    }
  });
}

function buildProductionPackage() {
  console.log('📦 A iniciar o empacotamento limpo para a Hostinger (PHP 8.3 + React SPA)...');

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

  // 4. Copiar API PHP 8.3 Nativa para public_html/api
  console.log('🔒 A copiar Backend API PHP 8.3 Nativa para public_html/api...');
  const apiPhpItemsToCopy = [
    'index.php',
    'health.php',
    '.htaccess',
    'config',
    'middleware',
    'helpers',
    'auth',
    'customers',
    'quotations',
    'vehicles',
    'drivers',
    'trips',
    'routes',
    'bookings',
    'invoices',
    'payments',
    'expenses',
    'maintenance',
    'stock',
    'notifications',
    'reports',
    'analytics',
    'settings',
    'ntandinho_hostinger_database.sql',
  ];

  for (const item of apiPhpItemsToCopy) {
    const srcPath = path.resolve(rootDir, 'api', item);
    const destPath = path.resolve(apiDestDir, item);
    if (fs.existsSync(srcPath)) {
      copyRecursive(srcPath, destPath, ['node_modules', 'dist', 'src', 'package.json', 'package-lock.json', 'app.js', 'dev.db', 'prisma', 'tsconfig.json']);
      console.log(`  ✓ api/${item}`);
    }
  }

  // Verificar se ficou qualquer resíduo Node.js ou dev
  const forbiddenItems = ['node_modules', 'package-lock.json', 'app.js', 'src', 'tsconfig.json'];
  for (const item of forbiddenItems) {
    const checkPath = path.resolve(apiDestDir, item);
    if (fs.existsSync(checkPath)) {
      fs.rmSync(checkPath, { recursive: true, force: true });
    }
  }

  const totalSize = calculateDirectorySize(publicHtmlDir);

  console.log('\n==================================================');
  console.log('✅ PACOTE DE PRODUÇÃO PHP 8.3 AUTOCONTIDO COM SUCESSO!');
  console.log(`📁 Pasta Gerada: ${publicHtmlDir}`);
  console.log(`📊 Tamanho Aproximado: ${formatBytes(totalSize)}`);
  console.log('==================================================\n');
}

buildProductionPackage();
