import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log("🌱 A verificar/semear dados iniciais na base de dados...");

  try {
    // 1. Criar ou Obter Role ADMIN
    let adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' },
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          name: 'ADMIN',
          description: 'Administrador Geral com acesso total ao ERP',
          isSystem: true,
        },
      });
      console.log('✅ Role ADMIN criada com sucesso.');
    }

    // 2. Criar ou Obter Permissão Total
    let wildcardPermission = await prisma.permission.findFirst({
      where: { action: '*', resource: '*' },
    });

    if (!wildcardPermission) {
      wildcardPermission = await prisma.permission.create({
        data: {
          action: '*',
          resource: '*',
          description: 'Acesso total a todos os recursos',
        },
      });

      await prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: wildcardPermission.id,
        },
      });
    }

    // 3. Criar ou Atualizar Utilizador Administrador Padrão
    const adminEmail = 'admin@ntandinho.co.mz';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin2026!', 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: "Administrador N' Tandinho",
          roleId: adminRole.id,
          isActive: true,
        },
      });
      console.log("✅ Administrador padrão (admin@ntandinho.co.mz) semeado na base de dados com sucesso!");
    } else {
      console.log("ℹ️ Administrador (admin@ntandinho.co.mz) já existe na base de dados.");
    }
  } catch (err) {
    console.error("❌ Erro ao semear base de dados:", err);
  } finally {
    await prisma.$disconnect();
  }
}

// Execução direta via CLI se chamado diretamente
if (require.main === module) {
  seedDatabase();
}
