import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando a povoação com DADOS OFICIAIS DO WEBSITE N' TANDINHO...");

  // 1. Roles & Permissions (RBAC)
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrador' },
    update: {},
    create: {
      name: 'Administrador',
      description: 'Acesso total a todas as áreas do ERP, definições do sistema e auditoria',
      permissions: {
        create: [
          { permission: '*:read' },
          { permission: '*:write' },
          { permission: '*:delete' },
          { permission: 'users:manage' },
          { permission: 'roles:manage' },
          { permission: 'cms:manage' }
        ]
      }
    }
  });

  const gestorRole = await prisma.role.upsert({
    where: { name: 'Gestor' },
    update: {},
    create: {
      name: 'Gestor',
      description: 'Gestão de operações de logística, frota de camiões, motoristas e CMS',
      permissions: {
        create: [
          { permission: 'trips:manage' },
          { permission: 'fleet:manage' },
          { permission: 'drivers:manage' },
          { permission: 'clients:manage' },
          { permission: 'cms:manage' }
        ]
      }
    }
  });

  const financeiroRole = await prisma.role.upsert({
    where: { name: 'Financeiro' },
    update: {},
    create: {
      name: 'Financeiro',
      description: 'Emissão de faturas em Meticais (MZN), pagamentos, despesas e relatórios',
      permissions: {
        create: [
          { permission: 'invoices:manage' },
          { permission: 'payments:manage' },
          { permission: 'expenses:manage' },
          { permission: 'reports:read' }
        ]
      }
    }
  });

  const operadorRole = await prisma.role.upsert({
    where: { name: 'Operador' },
    update: {},
    create: {
      name: 'Operador',
      description: 'Despacho de cargas, atualização de estado de viagens e reservas',
      permissions: {
        create: [
          { permission: 'trips:read' },
          { permission: 'trips:write' },
          { permission: 'bookings:manage' }
        ]
      }
    }
  });

  const motoristaRole = await prisma.role.upsert({
    where: { name: 'Motorista' },
    update: {},
    create: {
      name: 'Motorista',
      description: 'Consulta das viagens atribuídas e registo de combustível',
      permissions: {
        create: [
          { permission: 'trips:read_own' },
          { permission: 'fuel:write' }
        ]
      }
    }
  });

  // 2. Utilizadores de Teste
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ntandinho.co.mz' },
    update: { password: hashedPassword },
    create: {
      name: "Administrador N' Tandinho",
      email: "admin@ntandinho.co.mz",
      phone: "+258 84 000 0000",
      password: hashedPassword,
      roleId: adminRole.id,
      status: "Active",
      avatar: "/assets/Trans_Ntandinho (9)-rFc-Z1qH.jpeg"
    }
  });

  console.log(`👤 Utilizador Admin criado/atualizado: ${adminUser.email}`);

  // 3. Dados Institucionais Reais da Empresa (do Website)
  await prisma.company.upsert({
    where: { id: 'default-company' },
    update: {
      name: "Transportes N' Tandinho",
      phone: "+258 84 000 0000",
      email: "geral@ntandinho.co.mz",
      address: "Av. Eduardo Mondlane, Edifício Central",
      city: "Nampula",
      country: "Moçambique",
      workingHours: "Segunda a Sábado: 07:30 - 18:00"
    },
    create: {
      id: 'default-company',
      name: "Transportes N' Tandinho",
      nuit: "400123456",
      phone: "+258 84 000 0000",
      email: "geral@ntandinho.co.mz",
      address: "Av. Eduardo Mondlane, Edifício Central",
      city: "Nampula",
      country: "Moçambique",
      workingHours: "Segunda a Sábado: 07:30 - 18:00"
    }
  });

  // 4. Website Settings & SEO Metas
  await prisma.websiteSettings.upsert({
    where: { id: 'default-settings' },
    update: {
      siteName: "Transportes N' Tandinho",
      metaTitle: "Transportes N' Tandinho | Transporte e Logística em Moçambique",
      metaDescription: "Seguro com Eficiência. A sua transportadora de confiança em Moçambique, conectando negócios e pessoas de norte a sul.",
      facebookUrl: "https://facebook.com/ntandinho",
      linkedinUrl: "https://linkedin.com/company/ntandinho",
      whatsappNumber: "+258840000000"
    },
    create: {
      id: 'default-settings',
      siteName: "Transportes N' Tandinho",
      primaryColor: "#0F172A",
      secondaryColor: "#F97316",
      metaTitle: "Transportes N' Tandinho | Transporte e Logística em Moçambique",
      metaDescription: "Seguro com Eficiência. A sua transportadora de confiança em Moçambique, conectando negócios e pessoas de norte a sul.",
      facebookUrl: "https://facebook.com/ntandinho",
      linkedinUrl: "https://linkedin.com/company/ntandinho",
      whatsappNumber: "+258840000000"
    }
  });

  // 5. Hero & About CMS Data (Extraído do Website Oficial)
  await prisma.hero.upsert({
    where: { id: 'default-hero' },
    update: {
      title: "Transporte Seguro, Eficiente e Confiável",
      subtitle: "Especialistas em logística e mobilidade. De cargas valiosas a viagens executivas, movemos o seu negócio por toda Moçambique com total segurança e pontualidade.",
      buttonText: "Solicitar Serviço",
      buttonLink: "/#contacto",
      imageUrl: "/assets/Trans_Ntandinho (9)-rFc-Z1qH.jpeg",
      overlayOpacity: 0.65
    },
    create: {
      id: 'default-hero',
      title: "Transporte Seguro, Eficiente e Confiável",
      subtitle: "Especialistas em logística e mobilidade. De cargas valiosas a viagens executivas, movemos o seu negócio por toda Moçambique com total segurança e pontualidade.",
      buttonText: "Solicitar Serviço",
      buttonLink: "/#contacto",
      imageUrl: "/assets/Trans_Ntandinho (9)-rFc-Z1qH.jpeg",
      overlayOpacity: 0.65
    }
  });

  await prisma.about.upsert({
    where: { id: 'default-about' },
    update: {
      title: "A força motriz por trás do seu negócio em Nampula e além",
      description: "A Transportes N' Tandinho é uma empresa moçambicana de excelência, sediada em Nampula. Nascemos com o propósito de redefinir os padrões de logística e aluguer de viaturas na região norte e em todo o país.",
      mission: "Operar com padrões internacionais, garantindo que pessoas e mercadorias cheguem ao seu destino com máxima segurança, cuidado e dentro do prazo estipulado.",
      vision: "Ser a referência inquestionável no transporte de carga seca e pesada em Moçambique e no corredor SADC.",
      values: "Segurança, Eficiência, Responsabilidade e Profissionalismo.",
      imageUrl: "/assets/Trans_Ntandinho (5)-CBtNGbuS.jpeg"
    },
    create: {
      id: 'default-about',
      title: "A força motriz por trás do seu negócio em Nampula e além",
      description: "A Transportes N' Tandinho é uma empresa moçambicana de excelência, sediada em Nampula. Nascemos com o propósito de redefinir os padrões de logística e aluguer de viaturas na região norte e em todo o país.",
      mission: "Operar com padrões internacionais, garantindo que pessoas e mercadorias cheguem ao seu destino com máxima segurança, cuidado e dentro do prazo estipulado.",
      vision: "Ser a referência inquestionável no transporte de carga seca e pesada em Moçambique e no corredor SADC.",
      values: "Segurança, Eficiência, Responsabilidade e Profissionalismo.",
      imageUrl: "/assets/Trans_Ntandinho (5)-CBtNGbuS.jpeg"
    }
  });

  // 6. Frota de Camiões (com Imagens Oficiais do Website)
  const v1 = await prisma.vehicle.upsert({
    where: { plateNumber: 'AFB-452-MP' },
    update: {},
    create: {
      plateNumber: 'AFB-452-MP',
      brand: 'Volvo',
      model: 'FH 540 Globetrotter',
      year: 2023,
      capacity: '34 Toneladas (Contentores & Carga Geral)',
      fuelType: 'Diesel',
      insuranceNumber: 'INS-2026-8819',
      insuranceExpiry: new Date('2026-12-31'),
      inspectionExpiry: new Date('2026-11-15'),
      currentKm: 142500,
      status: 'Em Viagem',
      photo: '/assets/Trans_Ntandinho (1)-jvI6WQC_.jpeg'
    }
  });

  const v2 = await prisma.vehicle.upsert({
    where: { plateNumber: 'AHL-891-NP' },
    update: {},
    create: {
      plateNumber: 'AHL-891-NP',
      brand: 'Scania',
      model: 'R 500 V8 Streamline',
      year: 2022,
      capacity: '30 Toneladas',
      fuelType: 'Diesel',
      insuranceNumber: 'INS-2026-9042',
      insuranceExpiry: new Date('2026-10-20'),
      inspectionExpiry: new Date('2026-09-30'),
      currentKm: 189000,
      status: 'Disponivel',
      photo: '/assets/Trans_Ntandinho (2)-BuQKeiBU.jpeg'
    }
  });

  const v3 = await prisma.vehicle.upsert({
    where: { plateNumber: 'AIB-114-MC' },
    update: {},
    create: {
      plateNumber: 'AIB-114-MC',
      brand: 'Mercedes-Benz',
      model: 'Actros 3344 Heavy Hauler',
      year: 2021,
      capacity: '28 Toneladas',
      fuelType: 'Diesel',
      insuranceNumber: 'INS-2026-5511',
      insuranceExpiry: new Date('2026-08-15'),
      inspectionExpiry: new Date('2026-08-10'),
      currentKm: 230400,
      status: 'Manutencao',
      photo: '/assets/Trans_Ntandinho (3)-CS_SyyUk.jpeg'
    }
  });

  // 7. Motoristas Experientes
  const d1 = await prisma.driver.upsert({
    where: { licenseNumber: 'C-8849102-MZ' },
    update: {},
    create: {
      name: 'José Machava',
      phone: '+258 84 331 4455',
      email: 'jose.machava@ntandinho.co.mz',
      address: 'Bairro Muatala, Nampula',
      licenseNumber: 'C-8849102-MZ',
      licenseExpiry: new Date('2027-05-15'),
      salary: 45000,
      status: 'Em Viagem',
      photo: '/assets/Trans_Ntandinho (6)-YysXtpQ2.jpeg'
    }
  });

  const d2 = await prisma.driver.upsert({
    where: { licenseNumber: 'C-9920194-MZ' },
    update: {},
    create: {
      name: 'António Sitoe',
      phone: '+258 82 445 1122',
      email: 'antonio.sitoe@ntandinho.co.mz',
      address: 'Bairro de Nacala-Porto',
      licenseNumber: 'C-9920194-MZ',
      licenseExpiry: new Date('2028-01-20'),
      salary: 48000,
      status: 'Activo',
      photo: '/assets/Trans_Ntandinho (8)-B-UAUjaT.jpeg'
    }
  });

  // 8. Clientes Reais
  const c1 = await prisma.client.upsert({
    where: { email: 'logistica@cdm.co.mz' },
    update: {},
    create: {
      companyName: 'Cervejas de Moçambique (CDM)',
      contactPerson: 'Fernando Muthemba',
      phone: '+258 21 480 000',
      email: 'logistica@cdm.co.mz',
      address: 'Av. 25 de Setembro, Maputo',
      city: 'Maputo',
      province: 'Maputo Cidade',
      nuit: '400012991',
      notes: 'Contrato corporativo anual - Distribuição de bebidas Nacala/Blantyre'
    }
  });

  const c2 = await prisma.client.upsert({
    where: { email: 'compras@cfm.co.mz' },
    update: {},
    create: {
      companyName: 'Portos e Caminhos de Ferro de Moçambique (CFM)',
      contactPerson: 'Sandra Langa',
      phone: '+258 26 212 100',
      email: 'compras@cfm.co.mz',
      address: 'Porto de Nacala, Nampula',
      city: 'Nacala',
      province: 'Nampula',
      nuit: '400055123',
      notes: 'Transporte de peças e equipamento pesado industrial'
    }
  });

  // 9. Reservas & Viagens
  const b1 = await prisma.booking.create({
    data: {
      clientId: c1.id,
      pickupLocation: 'Porto de Nacala, Nampula',
      destination: 'Armazém Central, Blantyre (Malawi)',
      pickupDate: new Date('2026-08-02'),
      deliveryDate: new Date('2026-08-05'),
      cargoDescription: 'Carga Paletizada de Bebidas e Contentor 40ft',
      weight: '28 Toneladas',
      price: 285000,
      status: 'Em Viagem'
    }
  });

  const trip1 = await prisma.trip.upsert({
    where: { trackingCode: 'NT-2026-8941' },
    update: {},
    create: {
      bookingId: b1.id,
      driverId: d1.id,
      vehicleId: v1.id,
      departure: new Date('2026-08-02T06:00:00Z'),
      distance: 680,
      fuelCost: 45000,
      otherExpenses: 8500,
      status: 'Em Curso',
      notes: 'Rota Nacala -> Cuamba -> Mandimba -> Blantyre (SADC)',
      trackingCode: 'NT-2026-8941'
    }
  });

  // 10. Facturas & Pagamentos
  const inv1 = await prisma.invoice.upsert({
    where: { invoiceNumber: 'FT-2026/0084' },
    update: {},
    create: {
      invoiceNumber: 'FT-2026/0084',
      clientId: c1.id,
      tripId: trip1.id,
      amount: 285000,
      vat: 0.16,
      totalAmount: 330600,
      dueDate: new Date('2026-08-25'),
      status: 'Pendente'
    }
  });

  await prisma.payment.create({
    data: {
      invoiceId: inv1.id,
      amount: 150000,
      paymentMethod: 'Transferencia',
      reference: 'BIM-TRF-992019482',
      paidAt: new Date()
    }
  });

  // 11. Despesas
  await prisma.expense.createMany({
    data: [
      {
        category: 'Combustivel',
        description: 'Abastecimento 400L Diesel Camião Volvo AF-452 em Nampula',
        amount: 38000,
        date: new Date('2026-08-01')
      },
      {
        category: 'Manutencao',
        description: 'Substituição de Óleo e Filtros Scania R500 em Oficina Nampula',
        amount: 15500,
        date: new Date('2026-07-28')
      }
    ]
  });

  // 12. Mensagens do Website
  await prisma.contact.createMany({
    data: [
      {
        name: 'Alberto Mabote',
        email: 'alberto.mabote@empresa.co.mz',
        phone: '+258 84 991 0022',
        subject: 'Cotação de Aluguer de Camiões para Montepuez',
        message: 'Gostaria de solicitar uma cotação para o aluguer mensal de 2 camiões de 30T para transporte em Cabo Delgado.',
        status: 'Novo'
      }
    ]
  });

  console.log("✅ Povoação com dados oficiais concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
