const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { seedDatabase } = require('../dist/seed');

const prisma = new PrismaClient();

async function generateCompleteDump() {
  // 1. Garantir que a base de dados local tem os dados semeados antes do export
  console.log('🌱 A semear dados locais para garantir exportação completa...');
  await seedDatabase();

  const schemaSqlPath = path.join(__dirname, '../prisma/schema.sql');
  let schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');

  // Remover todas as linhas de comentários SQL (começadas por --)
  let cleanLines = schemaSql
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('--'))
    .join('\n');

  let sql = cleanLines + '\n\n';

  // 1. Roles
  const roles = await prisma.role.findMany();
  for (const r of roles) {
    const desc = r.description ? `'${r.description.replace(/'/g, "''")}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`roles\` (\`id\`, \`name\`, \`description\`, \`isSystem\`, \`createdAt\`, \`updatedAt\`) VALUES ('${r.id}', '${r.name}', ${desc}, ${r.isSystem ? 1 : 0}, NOW(), NOW());\n`;
  }

  // 2. Permissions
  const perms = await prisma.permission.findMany();
  for (const p of perms) {
    const desc = p.description ? `'${p.description.replace(/'/g, "''")}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`permissions\` (\`id\`, \`action\`, \`resource\`, \`description\`, \`createdAt\`) VALUES ('${p.id}', '${p.action}', '${p.resource}', ${desc}, NOW());\n`;
  }

  // 3. RolePermissions
  const rp = await prisma.rolePermission.findMany();
  for (const item of rp) {
    sql += `INSERT IGNORE INTO \`role_permissions\` (\`roleId\`, \`permissionId\`) VALUES ('${item.roleId}', '${item.permissionId}');\n`;
  }

  // 4. Users
  const users = await prisma.user.findMany();
  for (const u of users) {
    const phone = u.phone ? `'${u.phone}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`users\` (\`id\`, \`email\`, \`password\`, \`name\`, \`phone\`, \`roleId\`, \`isActive\`, \`createdAt\`, \`updatedAt\`) VALUES ('${u.id}', '${u.email}', '${u.password}', '${u.name.replace(/'/g, "''")}', ${phone}, '${u.roleId}', ${u.isActive ? 1 : 0}, NOW(), NOW());\n`;
  }

  // 5. Companies
  const companies = await prisma.company.findMany();
  for (const c of companies) {
    const addr = c.address ? `'${c.address.replace(/'/g, "''")}'` : 'NULL';
    const city = c.city ? `'${c.city.replace(/'/g, "''")}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`companies\` (\`id\`, \`name\`, \`nuit\`, \`email\`, \`phone\`, \`address\`, \`city\`, \`country\`, \`creditLimit\`, \`createdAt\`, \`updatedAt\`) VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.nuit}', '${c.email}', '${c.phone}', ${addr}, ${city}, '${c.country}', ${c.creditLimit}, NOW(), NOW());\n`;
  }

  // 6. Customers
  const customers = await prisma.customer.findMany();
  for (const c of customers) {
    const compId = c.companyId ? `'${c.companyId}'` : 'NULL';
    const nuit = c.nuit ? `'${c.nuit}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`customers\` (\`id\`, \`companyId\`, \`name\`, \`email\`, \`phone\`, \`nuit\`, \`isCorporate\`, \`status\`, \`createdAt\`, \`updatedAt\`) VALUES ('${c.id}', ${compId}, '${c.name.replace(/'/g, "''")}', '${c.email}', '${c.phone}', ${nuit}, ${c.isCorporate ? 1 : 0}, '${c.status}', NOW(), NOW());\n`;
  }

  // 7. Vehicles
  const vehicles = await prisma.vehicle.findMany();
  for (const v of vehicles) {
    const nextService = v.nextServiceKm ? v.nextServiceKm : 'NULL';
    sql += `INSERT IGNORE INTO \`vehicles\` (\`id\`, \`plateNumber\`, \`make\`, \`model\`, \`year\`, \`status\`, \`mileageKm\`, \`nextServiceKm\`, \`isAvailable\`, \`createdAt\`, \`updatedAt\`) VALUES ('${v.id}', '${v.plateNumber}', '${v.make}', '${v.model.replace(/'/g, "''")}', ${v.year}, '${v.status}', ${v.mileageKm}, ${nextService}, ${v.isAvailable ? 1 : 0}, NOW(), NOW());\n`;
  }

  // 8. Drivers
  const drivers = await prisma.driver.findMany();
  for (const d of drivers) {
    sql += `INSERT IGNORE INTO \`drivers\` (\`id\`, \`name\`, \`licenseNumber\`, \`phone\`, \`status\`, \`isAvailable\`, \`createdAt\`, \`updatedAt\`) VALUES ('${d.id}', '${d.name.replace(/'/g, "''")}', '${d.licenseNumber}', '${d.phone}', '${d.status}', ${d.isAvailable ? 1 : 0}, NOW(), NOW());\n`;
  }

  // 9. Routes
  const routes = await prisma.route.findMany();
  for (const r of routes) {
    const checkpoints = r.borderCheckpoints ? `'${r.borderCheckpoints.replace(/'/g, "''")}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`routes\` (\`id\`, \`name\`, \`origin\`, \`destination\`, \`distanceKm\`, \`estDurationHours\`, \`borderCheckpoints\`, \`createdAt\`) VALUES ('${r.id}', '${r.name.replace(/'/g, "''")}', '${r.origin}', '${r.destination}', ${r.distanceKm}, ${r.estDurationHours}, ${checkpoints}, NOW());\n`;
  }

  // 10. Quotations
  const quotations = await prisma.quotation.findMany();
  for (const q of quotations) {
    const compId = q.companyId ? `'${q.companyId}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`quotations\` (\`id\`, \`quotationNumber\`, \`customerId\`, \`companyId\`, \`origin\`, \`destination\`, \`cargoDescription\`, \`weightKg\`, \`priceSubtotal\`, \`taxAmount\`, \`totalPrice\`, \`currency\`, \`validUntil\`, \`status\`, \`createdAt\`, \`updatedAt\`) VALUES ('${q.id}', '${q.quotationNumber}', '${q.customerId}', ${compId}, '${q.origin}', '${q.destination}', '${q.cargoDescription.replace(/'/g, "''")}', ${q.weightKg}, ${q.priceSubtotal}, ${q.taxAmount}, ${q.totalPrice}, '${q.currency}', NOW(), '${q.status}', NOW(), NOW());\n`;
  }

  // 11. Contracts
  const contracts = await prisma.contract.findMany();
  for (const ct of contracts) {
    const compId = ct.companyId ? `'${ct.companyId}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`contracts\` (\`id\`, \`contractNumber\`, \`quotationId\`, \`customerId\`, \`companyId\`, \`startDate\`, \`endDate\`, \`totalAmount\`, \`status\`, \`createdAt\`, \`updatedAt\`) VALUES ('${ct.id}', '${ct.contractNumber}', '${ct.quotationId}', '${ct.customerId}', ${compId}, NOW(), NOW(), ${ct.totalAmount}, '${ct.status}', NOW(), NOW());\n`;
  }

  // 12. Trips
  const trips = await prisma.trip.findMany();
  for (const t of trips) {
    const ctId = t.contractId ? `'${t.contractId}'` : 'NULL';
    const rId = t.routeId ? `'${t.routeId}'` : 'NULL';
    const vId = t.vehicleId ? `'${t.vehicleId}'` : 'NULL';
    const dId = t.driverId ? `'${t.driverId}'` : 'NULL';
    const notes = t.notes ? `'${t.notes.replace(/'/g, "''")}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`trips\` (\`id\`, \`tripNumber\`, \`contractId\`, \`routeId\`, \`vehicleId\`, \`driverId\`, \`status\`, \`notes\`, \`createdAt\`, \`updatedAt\`) VALUES ('${t.id}', '${t.tripNumber}', ${ctId}, ${rId}, ${vId}, ${dId}, '${t.status}', ${notes}, NOW(), NOW());\n`;
  }

  // 13. Invoices
  const invoices = await prisma.invoice.findMany();
  for (const inv of invoices) {
    const tId = inv.tripId ? `'${inv.tripId}'` : 'NULL';
    const cId = inv.companyId ? `'${inv.companyId}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`invoices\` (\`id\`, \`invoiceNumber\`, \`tripId\`, \`customerId\`, \`companyId\`, \`subtotal\`, \`taxAmount\`, \`totalAmount\`, \`paidAmount\`, \`currency\`, \`dueDate\`, \`status\`, \`createdAt\`, \`updatedAt\`) VALUES ('${inv.id}', '${inv.invoiceNumber}', ${tId}, '${inv.customerId}', ${cId}, ${inv.subtotal}, ${inv.taxAmount}, ${inv.totalAmount}, ${inv.paidAmount}, '${inv.currency}', NOW(), '${inv.status}', NOW(), NOW());\n`;
  }

  // 14. Payments
  const payments = await prisma.payment.findMany();
  for (const p of payments) {
    const cId = p.customerId ? `'${p.customerId}'` : 'NULL';
    const ref = p.referenceNo ? `'${p.referenceNo.replace(/'/g, "''")}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`payments\` (\`id\`, \`paymentNumber\`, \`invoiceId\`, \`customerId\`, \`amount\`, \`paymentMethod\`, \`referenceNo\`, \`paidAt\`, \`createdAt\`) VALUES ('${p.id}', '${p.paymentNumber}', '${p.invoiceId}', ${cId}, ${p.amount}, '${p.paymentMethod}', ${ref}, NOW(), NOW());\n`;
  }

  // 15. Expenses
  const expenses = await prisma.expense.findMany();
  for (const ex of expenses) {
    const tId = ex.tripId ? `'${ex.tripId}'` : 'NULL';
    const vId = ex.vehicleId ? `'${ex.vehicleId}'` : 'NULL';
    const rec = ex.receiptNo ? `'${ex.receiptNo.replace(/'/g, "''")}'` : 'NULL';
    sql += `INSERT IGNORE INTO \`expenses\` (\`id\`, \`tripId\`, \`vehicleId\`, \`category\`, \`description\`, \`amount\`, \`receiptNo\`, \`date\`, \`createdAt\`) VALUES ('${ex.id}', ${tId}, ${vId}, '${ex.category}', '${ex.description.replace(/'/g, "''")}', ${ex.amount}, ${rec}, NOW(), NOW());\n`;
  }

  const outputPath = path.join(__dirname, '../ntandinho_hostinger_database.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log(`✅ Ficheiro SQL COMPLETO (Tabelas + Dados) criado com sucesso em: ${outputPath}`);
}

generateCompleteDump().catch(console.error).finally(() => prisma.$disconnect());
