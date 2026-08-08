import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  try {
    console.log("🌱 A iniciar semeação da base de dados ERP N' Tandinho...");

    // 1. Roles & Admin User
    let superAdminRole = await prisma.role.findUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
      superAdminRole = await prisma.role.create({
        data: {
          name: 'SUPER_ADMIN',
          description: 'Super Administrador com Acesso Total e Irrestrito',
          isSystem: true,
        },
      });
    }

    let adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' },
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          name: 'ADMIN',
          description: 'Administrador de Operações e Frota',
          isSystem: true,
        },
      });
    }

    // Criar roles adicionais
    const defaultRoles = [
      { name: 'GERENTE_FROTA', description: 'Gestão de Veículos, Motoristas e Manutenções' },
      { name: 'FINANCEIRO', description: 'Gestão de Faturas, Pagamentos e Despesas' },
      { name: 'MOTORISTA', description: 'Acesso a Guias de Transporte e Viagens Alocadas' },
      { name: 'CLIENTE', description: 'Acesso ao Portal de Clientes e Rastreio' },
    ];

    for (const r of defaultRoles) {
      const exists = await prisma.role.findUnique({ where: { name: r.name } });
      if (!exists) {
        await prisma.role.create({ data: { name: r.name, description: r.description, isSystem: true } });
      }
    }

    let wildcardPermission = await prisma.permission.findFirst({
      where: { action: '*', resource: '*' },
    });

    if (!wildcardPermission) {
      wildcardPermission = await prisma.permission.create({
        data: {
          action: '*',
          resource: '*',
          description: 'Acesso total a todos os recursos do sistema',
        },
      });

      await prisma.rolePermission.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: wildcardPermission.id,
        },
      });

      await prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: wildcardPermission.id,
        },
      });
    }

    // Administrador Principal
    const adminEmail = 'admin@ntandinho.co.mz';
    const defaultPassword = 'Admin2026!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Administrador',
          roleId: superAdminRole.id,
          isActive: true,
          deletedAt: null,
        },
      });
      console.log('  ✓ Utilizador Administrador criado com sucesso: admin@ntandinho.co.mz');
    } else {
      const isPasswordValid = await bcrypt.compare(defaultPassword, existingAdmin.password);
      if (!isPasswordValid || !existingAdmin.isActive || existingAdmin.deletedAt) {
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: {
            password: hashedPassword,
            name: 'Administrador',
            roleId: superAdminRole.id,
            isActive: true,
            deletedAt: null,
          },
        });
        console.log('  ✓ Utilizador Administrador atualizado e verificado.');
      } else {
        console.log('  ✓ Utilizador Administrador validado com sucesso.');
      }
    }

    // 2. Métodos de Pagamento Iniciais
    const paymentMethods = [
      { code: 'TRANSFERENCIA_BANCARIA', name: 'Transferência Bancária (BCI / Millennium BIM / Standard Bank)' },
      { code: 'MPESA', name: 'M-Pesa Vodacom' },
      { code: 'EMOLA', name: 'e-Mola Movitel' },
      { code: 'NUMERARIO', name: 'Numerário / Dinheiro' },
      { code: 'CHEQUE', name: 'Cheque Visado' },
    ];

    for (const pm of paymentMethods) {
      const exists = await prisma.paymentMethod.findUnique({ where: { code: pm.code } });
      if (!exists) {
        await prisma.paymentMethod.create({ data: pm });
      }
    }
    console.log('  ✓ Métodos de pagamento semeados.');

    // 3. Configurações Globais do ERP
    const defaultSettings = [
      { key: 'company_name', value: "N' Tandinho Transportes S.A.", description: 'Nome da Empresa' },
      { key: 'company_nuit', value: '400881920', description: 'NUIT da Empresa' },
      { key: 'currency', value: 'MZN', description: 'Moeda Padrão' },
      { key: 'tax_rate_percent', value: '16.0', description: 'Taxa de IVA (%)' },
      { key: 'support_phone', value: '+258 84 300 0000', description: 'Telefone de Suporte' },
      { key: 'system_status', value: 'OPERACIONAL', description: 'Estado do Sistema' },
    ];

    for (const s of defaultSettings) {
      const exists = await prisma.setting.findUnique({ where: { key: s.key } });
      if (!exists) {
        await prisma.setting.create({ data: s });
      }
    }
    console.log('  ✓ Configurações do sistema semeadas.');

    // 4. Categorias de Veículos
    const categories = [
      { name: 'Camião Pesado (Tractor)', description: 'Tractores de Longa Distância 6x4 / 4x2' },
      { name: 'Semi-Reboque (Trailer)', description: 'Atrelados de Carga Geral e Porta-Contentores' },
      { name: 'Camião Basculante (Dump Truck)', description: 'Transporte de Minérios e Agregados' },
      { name: 'Carrinha / Distribuição Leve', description: 'Distribuição Urbana e Encomendas' },
    ];

    for (const cat of categories) {
      const exists = await prisma.vehicleCategory.findUnique({ where: { name: cat.name } });
      if (!exists) {
        await prisma.vehicleCategory.create({ data: cat });
      }
    }

    // 5. Filiais / Sucursais
    const branches = [
      { name: 'Sede Maputo (Matola)', code: 'BR-MPT', city: 'Matola', address: 'Estrada Nacional N1, Km 15' },
      { name: 'Filial Beira (Corredor)', code: 'BR-BEI', city: 'Beira', address: 'Zona Industrial da Munhava' },
      { name: 'Filial Nacala (Porto)', code: 'BR-NCL', city: 'Nacala', address: 'Av. dos Trabalhadores' },
    ];

    for (const b of branches) {
      const exists = await prisma.branch.findUnique({ where: { code: b.code } });
      if (!exists) {
        await prisma.branch.create({ data: b });
      }
    }

    // 6. Empresas & Clientes Corporativos
    const companyCount = await prisma.company.count();
    if (companyCount === 0) {
      const company1 = await prisma.company.create({
        data: {
          name: 'Cervejas de Moçambique (CDM S.A.)',
          nuit: '400192834',
          email: 'logistica@cdm.co.mz',
          phone: '+258 21 480 100',
          address: 'Av. 25 de Setembro, Nº 1020',
          city: 'Maputo',
          creditLimit: 5000000.0,
        },
      });

      const company2 = await prisma.company.create({
        data: {
          name: 'Mozal S.A.',
          nuit: '400551920',
          email: 'supply@mozal.com',
          phone: '+258 21 720 000',
          address: 'Parque Industrial de Beluluane',
          city: 'Matola',
          creditLimit: 10000000.0,
        },
      });

      const company3 = await prisma.company.create({
        data: {
          name: 'Vulcan Minerals Moçambique',
          nuit: '400998811',
          email: 'transporte@vulcan.co.mz',
          phone: '+258 25 220 900',
          address: 'Mina de Carvão de Moatize',
          city: 'Tete',
          creditLimit: 8000000.0,
        },
      });

      const company4 = await prisma.company.create({
        data: {
          name: 'Coca-Cola Sabco Moçambique',
          nuit: '400281920',
          email: 'expedicao@cocacola.co.mz',
          phone: '+258 21 720 300',
          address: 'Bairro da Machava',
          city: 'Matola',
          creditLimit: 4000000.0,
        },
      });

      const company5 = await prisma.company.create({
        data: {
          name: 'Cimentos de Moçambique S.A.',
          nuit: '400334812',
          email: 'distribuicao@cimentos.co.mz',
          phone: '+258 21 350 200',
          address: 'Fábrica da Matola',
          city: 'Matola',
          creditLimit: 6000000.0,
        },
      });

      const c1 = await prisma.customer.create({
        data: {
          companyId: company1.id,
          name: 'Cervejas de Moçambique (CDM S.A.)',
          email: 'logistica@cdm.co.mz',
          phone: '+258 21 480 100',
          nuit: '400192834',
          isCorporate: true,
          status: 'ATIVO',
        },
      });

      const c2 = await prisma.customer.create({
        data: {
          companyId: company2.id,
          name: 'Mozal S.A.',
          email: 'supply@mozal.com',
          phone: '+258 21 720 000',
          nuit: '400551920',
          isCorporate: true,
          status: 'ATIVO',
        },
      });

      const c3 = await prisma.customer.create({
        data: {
          companyId: company3.id,
          name: 'Vulcan Minerals Moçambique',
          email: 'transporte@vulcan.co.mz',
          phone: '+258 25 220 900',
          nuit: '400998811',
          isCorporate: true,
          status: 'ATIVO',
        },
      });

      const c4 = await prisma.customer.create({
        data: {
          companyId: company4.id,
          name: 'Coca-Cola Sabco Moçambique',
          email: 'expedicao@cocacola.co.mz',
          phone: '+258 21 720 300',
          nuit: '400281920',
          isCorporate: true,
          status: 'ATIVO',
        },
      });

      const c5 = await prisma.customer.create({
        data: {
          companyId: company5.id,
          name: 'Cimentos de Moçambique S.A.',
          email: 'distribuicao@cimentos.co.mz',
          phone: '+258 21 350 200',
          nuit: '400334812',
          isCorporate: true,
          status: 'ATIVO',
        },
      });

      // 7. Frota de Veículos
      const v1 = await prisma.vehicle.create({
        data: {
          plateNumber: 'ABM-849-MC',
          make: 'Volvo',
          model: 'FH16 750 HP (3 Eixos)',
          year: 2024,
          status: 'EM_VIAGEM',
          mileageKm: 124500,
          nextServiceKm: 130000,
          isAvailable: false,
        },
      });

      const v2 = await prisma.vehicle.create({
        data: {
          plateNumber: 'AFK-302-MC',
          make: 'Scania',
          model: 'R500 V8 Streamline',
          year: 2023,
          status: 'EM_VIAGEM',
          mileageKm: 88200,
          nextServiceKm: 95000,
          isAvailable: false,
        },
      });

      const v3 = await prisma.vehicle.create({
        data: {
          plateNumber: 'AGG-119-MC',
          make: 'DAF',
          model: 'XF 530 Super Space Cab',
          year: 2025,
          status: 'OPERACIONAL',
          mileageKm: 45000,
          nextServiceKm: 60000,
          isAvailable: true,
        },
      });

      const v4 = await prisma.vehicle.create({
        data: {
          plateNumber: 'AEK-201-MC',
          make: 'Mercedes-Benz',
          model: 'Actros 3354 6x4',
          year: 2023,
          status: 'EM_VIAGEM',
          mileageKm: 105400,
          nextServiceKm: 110000,
          isAvailable: false,
        },
      });

      const v5 = await prisma.vehicle.create({
        data: {
          plateNumber: 'ADZ-990-MC',
          make: 'MAN',
          model: 'TGX 26.540 6x4',
          year: 2024,
          status: 'EM_VIAGEM',
          mileageKm: 67300,
          nextServiceKm: 75000,
          isAvailable: false,
        },
      });

      // 8. Motoristas
      const d1 = await prisma.driver.create({
        data: {
          name: 'João Mucavel',
          licenseNumber: 'C-901823',
          phone: '+258 84 901 8822',
          status: 'EM_VIAGEM',
          isAvailable: false,
        },
      });

      const d2 = await prisma.driver.create({
        data: {
          name: 'Mateus Sitoe',
          licenseNumber: 'C-445129',
          phone: '+258 82 445 1199',
          status: 'EM_VIAGEM',
          isAvailable: false,
        },
      });

      const d3 = await prisma.driver.create({
        data: {
          name: 'Carlos Alberto Nhantumbo',
          licenseNumber: 'C-772910',
          phone: '+258 84 772 9900',
          status: 'DISPONIVEL',
          isAvailable: true,
        },
      });

      const d4 = await prisma.driver.create({
        data: {
          name: 'Paulo Mondlane',
          licenseNumber: 'C-338192',
          phone: '+258 86 338 1900',
          status: 'EM_VIAGEM',
          isAvailable: false,
        },
      });

      // 9. Rotas SADC & Nacionais
      const r1 = await prisma.route.create({
        data: {
          name: 'Maputo ➔ Nampula (Corredor N1)',
          origin: 'Maputo',
          destination: 'Nampula',
          distanceKm: 2150.0,
          estDurationHours: 36.0,
          borderCheckpoints: 'N/A (Nacional)',
        },
      });

      const r2 = await prisma.route.create({
        data: {
          name: 'Beira ➔ Lilongwe (Malawi)',
          origin: 'Beira',
          destination: 'Lilongwe (Malawi)',
          distanceKm: 950.0,
          estDurationHours: 20.0,
          borderCheckpoints: 'Fronteira de Cuchamano / Zóbuè',
        },
      });

      const r3 = await prisma.route.create({
        data: {
          name: 'Nacala ➔ Blantyre (Corredor de Nacala)',
          origin: 'Nacala',
          destination: 'Blantyre (Malawi)',
          distanceKm: 820.0,
          estDurationHours: 16.0,
          borderCheckpoints: 'Fronteira de Entre-Lagos',
        },
      });

      // 10. Cotações & Contratos
      const q1 = await prisma.quotation.create({
        data: {
          quotationNumber: 'COT-2026-001',
          customerId: c1.id,
          companyId: company1.id,
          origin: 'Maputo',
          destination: 'Nampula',
          cargoDescription: 'Paletes de Cerveja e Refrigerantes (Container 40ft)',
          weightKg: 28000.0,
          priceSubtotal: 350000.0,
          taxAmount: 56000.0,
          totalPrice: 406000.0,
          currency: 'MZN',
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: 'APROVADA',
        },
      });

      const ct1 = await prisma.contract.create({
        data: {
          contractNumber: 'CTR-2026-101',
          quotationId: q1.id,
          customerId: c1.id,
          companyId: company1.id,
          startDate: new Date('2026-01-01'),
          endDate: new Date('2026-12-31'),
          totalAmount: 4860000.0,
          status: 'ATIVO',
        },
      });

      // 11. Viagens
      const t1 = await prisma.trip.create({
        data: {
          tripNumber: 'TRIP-2026-901',
          contractId: ct1.id,
          routeId: r1.id,
          vehicleId: v1.id,
          driverId: d1.id,
          status: 'EM_TRANSITO',
          departureTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
          notes: 'Cervejas em Paletes. Camião em rota Nampula->Beira.',
        },
      });

      // 12. Faturas & Pagamentos
      const inv1 = await prisma.invoice.create({
        data: {
          invoiceNumber: 'FT-2026-001',
          tripId: t1.id,
          customerId: c1.id,
          companyId: company1.id,
          subtotal: 350000.0,
          taxAmount: 56000.0,
          totalAmount: 406000.0,
          paidAmount: 406000.0,
          currency: 'MZN',
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: 'PAGO',
        },
      });

      await prisma.payment.create({
        data: {
          paymentNumber: 'REC-2026-001',
          invoiceId: inv1.id,
          customerId: c1.id,
          amount: 406000.0,
          paymentMethod: 'TRANSFERENCIA_BANCARIA',
          referenceNo: 'BCI-90182377',
          paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      });
    }

    console.log("✅ Base de Dados semeada com sucesso para produção no ERP N' Tandinho!");
  } catch (err) {
    console.error("❌ Erro ao semear base de dados:", err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}
