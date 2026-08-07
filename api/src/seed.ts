import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  try {
    // 1. Roles & Admin User
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
    }

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
          roleId: adminRole.id,
          isActive: true,
          deletedAt: null,
        },
      });
      console.log('✅ Utilizador Administrador criado com sucesso: admin@ntandinho.co.mz');
    } else {
      const isPasswordValid = await bcrypt.compare(defaultPassword, existingAdmin.password);
      if (!isPasswordValid || !existingAdmin.isActive || existingAdmin.deletedAt) {
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: {
            password: hashedPassword,
            name: 'Administrador',
            roleId: adminRole.id,
            isActive: true,
            deletedAt: null,
          },
        });
        console.log('🔄 Utilizador Administrador corrigido e atualizado com palavra-passe válida.');
      } else {
        console.log('✔ Utilizador Administrador validado com sucesso.');
      }
    }

    // 2. Empresas & Clientes Corporativos
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

      const company6 = await prisma.company.create({
        data: {
          name: 'Fazendas Agrícolas de Nampula Lda',
          nuit: '400551928',
          email: 'compras@fazendasnampula.co.mz',
          phone: '+258 26 218 440',
          address: 'Estrada Nacional N1, Km 12',
          city: 'Nampula',
          creditLimit: 2500000.0,
        },
      });

      // Clientes
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

      const c6 = await prisma.customer.create({
        data: {
          companyId: company6.id,
          name: 'Fazendas Agrícolas de Nampula Lda',
          email: 'compras@fazendasnampula.co.mz',
          phone: '+258 26 218 440',
          nuit: '400551928',
          isCorporate: true,
          status: 'ATIVO',
        },
      });

      // 3. Frota de Camiões (Vehicles)
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

      const v6 = await prisma.vehicle.create({
        data: {
          plateNumber: 'AHB-405-MC',
          make: 'Volvo',
          model: 'FMX 460 Dump Truck',
          year: 2024,
          status: 'MANUTENCAO',
          mileageKm: 142000,
          nextServiceKm: 140000,
          isAvailable: false,
        },
      });

      const v7 = await prisma.vehicle.create({
        data: {
          plateNumber: 'AIC-772-MC',
          make: 'Scania',
          model: 'G460 Heavy Hauler',
          year: 2025,
          status: 'OPERACIONAL',
          mileageKm: 28900,
          nextServiceKm: 40000,
          isAvailable: true,
        },
      });

      // 4. Motoristas (Drivers)
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

      const d5 = await prisma.driver.create({
        data: {
          name: 'Bernardo Cossa',
          licenseNumber: 'C-551029',
          phone: '+258 84 551 0022',
          status: 'EM_VIAGEM',
          isAvailable: false,
        },
      });

      const d6 = await prisma.driver.create({
        data: {
          name: 'Tomas Macamo',
          licenseNumber: 'C-882019',
          phone: '+258 82 882 0111',
          status: 'DISPONIVEL',
          isAvailable: true,
        },
      });

      // 5. Rotas SADC & Nacionais (Routes)
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

      const r4 = await prisma.route.create({
        data: {
          name: 'Pemba ➔ Palma (Projecto Gás LNG)',
          origin: 'Pemba',
          destination: 'Palma (Afungi)',
          distanceKm: 410.0,
          estDurationHours: 8.0,
          borderCheckpoints: 'N/A (Nacional)',
        },
      });

      const r5 = await prisma.route.create({
        data: {
          name: 'Tete ➔ Beira (Corredor do Carvão)',
          origin: 'Moatize (Tete)',
          destination: 'Porto da Beira',
          distanceKm: 590.0,
          estDurationHours: 11.0,
          borderCheckpoints: 'N/A (Nacional)',
        },
      });

      // 6. Cotações (Quotations)
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

      const q2 = await prisma.quotation.create({
        data: {
          quotationNumber: 'COT-2026-002',
          customerId: c2.id,
          companyId: company2.id,
          origin: 'Beira',
          destination: 'Lilongwe (Malawi)',
          cargoDescription: 'Lingotes de Alumínio Exportação (Carga SADC)',
          weightKg: 32000.0,
          priceSubtotal: 520000.0,
          taxAmount: 83200.0,
          totalPrice: 603200.0,
          currency: 'MZN',
          validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          status: 'APROVADA',
        },
      });

      const q3 = await prisma.quotation.create({
        data: {
          quotationNumber: 'COT-2026-003',
          customerId: c3.id,
          companyId: company3.id,
          origin: 'Moatize (Tete)',
          destination: 'Porto da Beira',
          cargoDescription: 'Equipamento Industrial de Mineração',
          weightKg: 40000.0,
          priceSubtotal: 480000.0,
          taxAmount: 76800.0,
          totalPrice: 556800.0,
          currency: 'MZN',
          validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: 'ENVIADA',
        },
      });

      const q4 = await prisma.quotation.create({
        data: {
          quotationNumber: 'COT-2026-004',
          customerId: c5.id,
          companyId: company5.id,
          origin: 'Matola',
          destination: 'Nampula',
          cargoDescription: 'Sacos de Cimento Portland (Carga a Granel 34T)',
          weightKg: 34000.0,
          priceSubtotal: 380000.0,
          taxAmount: 60800.0,
          totalPrice: 440800.0,
          currency: 'MZN',
          validUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
          status: 'APROVADA',
        },
      });

      // 7. Contratos (Contracts)
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

      const ct2 = await prisma.contract.create({
        data: {
          contractNumber: 'CTR-2026-102',
          quotationId: q2.id,
          customerId: c2.id,
          companyId: company2.id,
          startDate: new Date('2026-02-01'),
          endDate: new Date('2026-11-30'),
          totalAmount: 7238000.0,
          status: 'ATIVO',
        },
      });

      const ct3 = await prisma.contract.create({
        data: {
          contractNumber: 'CTR-2026-103',
          quotationId: q4.id,
          customerId: c5.id,
          companyId: company5.id,
          startDate: new Date('2026-03-01'),
          endDate: new Date('2026-12-31'),
          totalAmount: 3950000.0,
          status: 'ATIVO',
        },
      });

      // 8. Viagens (Trips)
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

      const t2 = await prisma.trip.create({
        data: {
          tripNumber: 'TRIP-2026-902',
          contractId: ct2.id,
          routeId: r2.id,
          vehicleId: v2.id,
          driverId: d2.id,
          status: 'EM_TRANSITO',
          departureTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
          notes: 'Lingotes de Alumínio SADC rumo a Lilongwe.',
        },
      });

      const t3 = await prisma.trip.create({
        data: {
          tripNumber: 'TRIP-2026-903',
          contractId: ct3.id,
          routeId: r3.id,
          vehicleId: v4.id,
          driverId: d4.id,
          status: 'EM_TRANSITO',
          departureTime: new Date(Date.now() - 18 * 60 * 60 * 1000),
          notes: 'Despacho de Cimento para a Região Norte.',
        },
      });

      const t4 = await prisma.trip.create({
        data: {
          tripNumber: 'TRIP-2026-904',
          contractId: ct1.id,
          routeId: r4.id,
          vehicleId: v5.id,
          driverId: d5.id,
          status: 'ALOCADO',
          notes: 'Aguarda carregamento no Porto de Pemba.',
        },
      });

      const t5 = await prisma.trip.create({
        data: {
          tripNumber: 'TRIP-2026-880',
          contractId: ct2.id,
          routeId: r5.id,
          vehicleId: v3.id,
          driverId: d3.id,
          status: 'CONCLUIDO',
          departureTime: new Date(Date.now() - 72 * 60 * 60 * 1000),
          arrivalTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          notes: 'Entrega efetuada com sucesso no Porto da Beira.',
        },
      });

      // 9. Faturas (Invoices)
      const inv1 = await prisma.invoice.create({
        data: {
          invoiceNumber: 'FT-2026-001',
          tripId: t1.id,
          customerId: c1.id,
          companyId: company1.id,
          subtotal: 350000.0,
          taxAmount: 56000.0,
          totalAmount: 406000.0,
          paidAmount: 0.0,
          currency: 'MZN',
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: 'PENDENTE',
        },
      });

      const inv2 = await prisma.invoice.create({
        data: {
          invoiceNumber: 'FT-2026-002',
          tripId: t2.id,
          customerId: c2.id,
          companyId: company2.id,
          subtotal: 520000.0,
          taxAmount: 83200.0,
          totalAmount: 603200.0,
          paidAmount: 603200.0,
          currency: 'MZN',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'PAGO',
        },
      });

      const inv3 = await prisma.invoice.create({
        data: {
          invoiceNumber: 'FT-2026-003',
          tripId: t5.id,
          customerId: c3.id,
          companyId: company3.id,
          subtotal: 480000.0,
          taxAmount: 76800.0,
          totalAmount: 556800.0,
          paidAmount: 300000.0,
          currency: 'MZN',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          status: 'PAGO_PARCIAL',
        },
      });

      const inv4 = await prisma.invoice.create({
        data: {
          invoiceNumber: 'FT-2026-004',
          tripId: t3.id,
          customerId: c5.id,
          companyId: company5.id,
          subtotal: 380000.0,
          taxAmount: 60800.0,
          totalAmount: 440800.0,
          paidAmount: 440800.0,
          currency: 'MZN',
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: 'PAGO',
        },
      });

      // 10. Pagamentos (Payments)
      await prisma.payment.create({
        data: {
          paymentNumber: 'REC-2026-001',
          invoiceId: inv2.id,
          customerId: c2.id,
          amount: 603200.0,
          paymentMethod: 'TRANSFERENCIA_BANCARIA',
          referenceNo: 'BVM-90182377',
          paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      });

      await prisma.payment.create({
        data: {
          paymentNumber: 'REC-2026-002',
          invoiceId: inv3.id,
          customerId: c3.id,
          amount: 300000.0,
          paymentMethod: 'TRANSFERENCIA_BANCARIA',
          referenceNo: 'BCI-4491028',
          paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      });

      await prisma.payment.create({
        data: {
          paymentNumber: 'REC-2026-003',
          invoiceId: inv4.id,
          customerId: c5.id,
          amount: 440800.0,
          paymentMethod: 'TRANSFERENCIA_BANCARIA',
          referenceNo: 'STD-8829102',
          paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      });

      // 11. Despesas de Operação (Expenses)
      await prisma.expense.create({
        data: {
          tripId: t1.id,
          vehicleId: v1.id,
          category: 'COMBUSTIVEL',
          description: 'Abastecimento Diesel 450L em Save',
          amount: 43650.0,
          receiptNo: 'REC-PETROMOC-9921',
        },
      });

      await prisma.expense.create({
        data: {
          tripId: t2.id,
          vehicleId: v2.id,
          category: 'PORTAGEM',
          description: 'Taxa de Portagem e Fronteira Zóbuè',
          amount: 18500.0,
          receiptNo: 'PORT-ZOB-401',
        },
      });

      await prisma.expense.create({
        data: {
          tripId: t1.id,
          vehicleId: v1.id,
          category: 'SUBSIDIO',
          description: 'Subsídio de Viagem e Alimentação Motorista',
          amount: 15000.0,
          receiptNo: 'SUB-JOAO-01',
        },
      });

      await prisma.expense.create({
        data: {
          vehicleId: v6.id,
          category: 'MANUTENCAO',
          description: 'Mudança de Óleo, Filtros e Revisão dos Traves',
          amount: 78000.0,
          receiptNo: 'SERV-VOLVO-881',
        },
      });
    }

    console.log("✅ Base de Dados semeada com sucesso com dados fictícios do ERP N' Tandinho!");
  } catch (err) {
    console.error("❌ Erro ao semear base de dados:", err);
  } finally {
    await prisma.$disconnect();
  }
}
