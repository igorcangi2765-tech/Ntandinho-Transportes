-- ====================================================================
-- ESTRUTURA E DADOS DA BASE DE DADOS MYSQL PARA HOSTINGER
-- ERP N' TANDINHO TRANSPORTES S.A.
-- Gerado Automaticamente em: 2026-08-07T18:12:06.111Z
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET NAMES utf8mb4;

-- --------------------------------------------------------
-- Tabela `roles`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `isSystem` TINYINT(1) NOT NULL DEFAULT 0,
  `deletedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `roles` (`id`, `name`, `description`, `isSystem`, `createdAt`, `updatedAt`) VALUES ('f670c9ef-c4f5-43fe-8d38-3451c41118e2', 'ADMIN', 'Administrador Geral com acesso total ao ERP', 1, NOW(), NOW());
INSERT IGNORE INTO `roles` (`id`, `name`, `description`, `isSystem`, `createdAt`, `updatedAt`) VALUES ('7b78dfea-13ba-46de-a4d0-77d93e3ff99b', 'SUPER_ADMIN', 'Super Administrador com Acesso Total e Irrestrito', 1, NOW(), NOW());
INSERT IGNORE INTO `roles` (`id`, `name`, `description`, `isSystem`, `createdAt`, `updatedAt`) VALUES ('939d9972-7d81-4381-972c-4f0f9bb34aa6', 'GERENTE_FROTA', 'Gestão de Veículos, Motoristas e Manutenções', 1, NOW(), NOW());
INSERT IGNORE INTO `roles` (`id`, `name`, `description`, `isSystem`, `createdAt`, `updatedAt`) VALUES ('59e6abe1-63df-4091-9286-3f4daede14d7', 'FINANCEIRO', 'Gestão de Faturas, Pagamentos e Despesas', 1, NOW(), NOW());
INSERT IGNORE INTO `roles` (`id`, `name`, `description`, `isSystem`, `createdAt`, `updatedAt`) VALUES ('fc0ed8a6-ae8c-4dd5-979c-b6ea2b554322', 'MOTORISTA', 'Acesso a Guias de Transporte e Viagens Alocadas', 1, NOW(), NOW());
INSERT IGNORE INTO `roles` (`id`, `name`, `description`, `isSystem`, `createdAt`, `updatedAt`) VALUES ('acc36be2-c012-4d71-8fff-2bf4606b4f0f', 'CLIENTE', 'Acesso ao Portal de Clientes e Rastreio', 1, NOW(), NOW());

-- Tabela `permissions`
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` VARCHAR(191) NOT NULL,
  `action` VARCHAR(191) NOT NULL,
  `resource` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_action_resource_key` (`action`, `resource`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `permissions` (`id`, `action`, `resource`, `description`, `createdAt`) VALUES ('b9091adb-f20c-45c0-bbe6-dc83eb641899', '*', '*', 'Acesso total a todos os recursos', NOW());

-- Tabela `role_permissions`
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `roleId` VARCHAR(191) NOT NULL,
  `permissionId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`roleId`, `permissionId`),
  CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `role_permissions` (`roleId`, `permissionId`) VALUES ('f670c9ef-c4f5-43fe-8d38-3451c41118e2', 'b9091adb-f20c-45c0-bbe6-dc83eb641899');

-- Tabela `user_roles`
CREATE TABLE IF NOT EXISTS `user_roles` (
  `userId` VARCHAR(191) NOT NULL,
  `roleId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`userId`, `roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela `users`
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `roleId` VARCHAR(191) NOT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `deletedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `users` (`id`, `email`, `password`, `name`, `phone`, `roleId`, `isActive`, `createdAt`, `updatedAt`) VALUES ('7f173bc4-672b-49dc-83cd-aaf362b1d5c5', 'admin@ntandinho.co.mz', '$2a$10$GeI5LuqSkU/kxvG3fm/gtumXxJi14CJ1LCt2PvaE8Md9oVGv.PY6C', 'Administrador', NULL, 'f670c9ef-c4f5-43fe-8d38-3451c41118e2', 1, NOW(), NOW());

-- Tabela `payment_methods`
CREATE TABLE IF NOT EXISTS `payment_methods` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `payment_methods` (`id`, `code`, `name`, `isActive`, `createdAt`) VALUES ('a1d09a37-47e4-40ca-9dc4-db08761201f3', 'TRANSFERENCIA_BANCARIA', 'Transferência Bancária (BCI / Millennium BIM / Standard Bank)', 1, NOW());
INSERT IGNORE INTO `payment_methods` (`id`, `code`, `name`, `isActive`, `createdAt`) VALUES ('5810bf7d-3daf-49f1-a250-1a8f80c7e53b', 'MPESA', 'M-Pesa Vodacom', 1, NOW());
INSERT IGNORE INTO `payment_methods` (`id`, `code`, `name`, `isActive`, `createdAt`) VALUES ('56d53761-925e-4883-85eb-1dee59c399f1', 'EMOLA', 'e-Mola Movitel', 1, NOW());
INSERT IGNORE INTO `payment_methods` (`id`, `code`, `name`, `isActive`, `createdAt`) VALUES ('d5350e58-7f07-49ac-86f0-a23a9de5e25a', 'NUMERARIO', 'Numerário / Dinheiro', 1, NOW());
INSERT IGNORE INTO `payment_methods` (`id`, `code`, `name`, `isActive`, `createdAt`) VALUES ('1dd97f3e-cee4-4d58-941e-713c10fd1383', 'CHEQUE', 'Cheque Visado', 1, NOW());

-- Tabela `settings`
CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL UNIQUE,
  `value` TEXT NOT NULL,
  `description` TEXT NULL,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `settings` (`id`, `key`, `value`, `description`, `updatedAt`) VALUES ('7e546d3c-8ddf-4ddd-95fe-ce91237a6a65', 'company_name', 'N'' Tandinho Transportes S.A.', 'Nome da Empresa', NOW());
INSERT IGNORE INTO `settings` (`id`, `key`, `value`, `description`, `updatedAt`) VALUES ('45350815-1766-48f7-9be2-1f074a3c1700', 'company_nuit', '400881920', 'NUIT da Empresa', NOW());
INSERT IGNORE INTO `settings` (`id`, `key`, `value`, `description`, `updatedAt`) VALUES ('31f2170c-4e8d-45ae-b5fd-746d0ea61630', 'currency', 'MZN', 'Moeda Padrão', NOW());
INSERT IGNORE INTO `settings` (`id`, `key`, `value`, `description`, `updatedAt`) VALUES ('305a9bfe-43e0-453c-971c-519faa5ab69d', 'tax_rate_percent', '16.0', 'Taxa de IVA (%)', NOW());
INSERT IGNORE INTO `settings` (`id`, `key`, `value`, `description`, `updatedAt`) VALUES ('64c71771-31c0-4db0-be16-18b85f8d6977', 'support_phone', '+258 84 300 0000', 'Telefone de Suporte', NOW());
INSERT IGNORE INTO `settings` (`id`, `key`, `value`, `description`, `updatedAt`) VALUES ('a0eda2b9-a615-4afd-9c93-47e6d2d167a6', 'system_status', 'OPERACIONAL', 'Estado do Sistema', NOW());

-- Tabela `companies`
CREATE TABLE IF NOT EXISTS `companies` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `nuit` VARCHAR(191) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `address` VARCHAR(191) NULL,
  `city` VARCHAR(191) NULL,
  `country` VARCHAR(191) NOT NULL DEFAULT 'Moçambique',
  `creditLimit` DOUBLE NOT NULL DEFAULT 0.0,
  `deletedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('c3ab3e2c-eb94-4db2-9b5e-69ea78b4f43e', 'Cervejas de Moçambique (CDM S.A.)', '400192834', 'logistica@cdm.co.mz', '+258 21 480 100', 'Av. 25 de Setembro, Nº 1020', 'Maputo', 'Moçambique', 5000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('059bf6a5-d56f-45a7-985f-3630131a6792', 'Mozal S.A.', '400551920', 'supply@mozal.com', '+258 21 720 000', 'Parque Industrial de Beluluane', 'Matola', 'Moçambique', 10000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('48e4eaf8-8f7d-4e3c-aa25-f1b5c7b45bf5', 'Vulcan Minerals Moçambique', '400998811', 'transporte@vulcan.co.mz', '+258 25 220 900', 'Mina de Carvão de Moatize', 'Tete', 'Moçambique', 8000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('10e6841e-01a9-42d7-8d8c-94489a90a4a5', 'Coca-Cola Sabco Moçambique', '400281920', 'expedicao@cocacola.co.mz', '+258 21 720 300', 'Bairro da Machava', 'Matola', 'Moçambique', 4000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('d7cfcf12-760d-43f8-8fc5-ad18ae2e7ea9', 'Cimentos de Moçambique S.A.', '400334812', 'distribuicao@cimentos.co.mz', '+258 21 350 200', 'Fábrica da Matola', 'Matola', 'Moçambique', 6000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('404bc95b-4fdc-47b9-99aa-3ecb5191c223', 'Fazendas Agrícolas de Nampula Lda', '400551928', 'compras@fazendasnampula.co.mz', '+258 26 218 440', 'Estrada Nacional N1, Km 12', 'Nampula', 'Moçambique', 2500000, NOW(), NOW());

-- Tabela `branches`
CREATE TABLE IF NOT EXISTS `branches` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NULL UNIQUE,
  `city` VARCHAR(191) NULL,
  `address` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NULL,
  `email` VARCHAR(191) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `branches` (`id`, `name`, `code`, `city`, `address`, `isActive`, `createdAt`, `updatedAt`) VALUES ('c99c6c87-1c77-4b3a-aa5f-114b5e36fcbf', 'Sede Maputo (Matola)', 'BR-MPT', 'Matola', 'Estrada Nacional N1, Km 15', 1, NOW(), NOW());
INSERT IGNORE INTO `branches` (`id`, `name`, `code`, `city`, `address`, `isActive`, `createdAt`, `updatedAt`) VALUES ('0a02133b-2c26-4ead-9f5a-17ffdb58e660', 'Filial Beira (Corredor)', 'BR-BEI', 'Beira', 'Zona Industrial da Munhava', 1, NOW(), NOW());
INSERT IGNORE INTO `branches` (`id`, `name`, `code`, `city`, `address`, `isActive`, `createdAt`, `updatedAt`) VALUES ('0247b564-9bbb-4ada-8034-d1dbf0a90301', 'Filial Nacala (Porto)', 'BR-NCL', 'Nacala', 'Av. dos Trabalhadores', 1, NOW(), NOW());

-- Tabela `vehicle_categories`
CREATE TABLE IF NOT EXISTS `vehicle_categories` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `vehicle_categories` (`id`, `name`, `description`, `createdAt`) VALUES ('b5e76df0-0352-4005-9fa3-5c2ddf546046', 'Camião Pesado (Tractor)', 'Tractores de Longa Distância 6x4 / 4x2', NOW());
INSERT IGNORE INTO `vehicle_categories` (`id`, `name`, `description`, `createdAt`) VALUES ('549c299c-ccd4-4a6c-89a9-ea4b8d0314aa', 'Semi-Reboque (Trailer)', 'Atrelados de Carga Geral e Porta-Contentores', NOW());
INSERT IGNORE INTO `vehicle_categories` (`id`, `name`, `description`, `createdAt`) VALUES ('0f53a7f0-e608-4409-b51c-1e9ebc2ddf37', 'Camião Basculante (Dump Truck)', 'Transporte de Minérios e Agregados', NOW());
INSERT IGNORE INTO `vehicle_categories` (`id`, `name`, `description`, `createdAt`) VALUES ('e061f586-6c47-4d22-a7d2-959bbd156f94', 'Carrinha / Distribuição Leve', 'Distribuição Urbana e Encomendas', NOW());

-- Tabela `vehicles`
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` VARCHAR(191) NOT NULL,
  `plateNumber` VARCHAR(191) NOT NULL UNIQUE,
  `make` VARCHAR(191) NOT NULL,
  `model` VARCHAR(191) NOT NULL,
  `year` INT NOT NULL,
  `categoryId` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'OPERACIONAL',
  `mileageKm` DOUBLE NOT NULL DEFAULT 0.0,
  `nextServiceKm` DOUBLE NULL,
  `licenseExpiry` DATETIME(3) NULL,
  `isAvailable` TINYINT(1) NOT NULL DEFAULT 1,
  `deletedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `vehicles_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `vehicle_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('df7af95b-3ee7-4001-9a06-f262880d31ba', 'ABM-849-MC', 'Volvo', 'FH16 750 HP (3 Eixos)', 2024, 'EM_VIAGEM', 124500, 130000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('f3f4815b-53fc-465e-895b-01210e9f8a3d', 'AFK-302-MC', 'Scania', 'R500 V8 Streamline', 2023, 'EM_VIAGEM', 88200, 95000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('63ddc336-cf58-4436-83e5-c09ad7dfe364', 'AGG-119-MC', 'DAF', 'XF 530 Super Space Cab', 2025, 'OPERACIONAL', 45000, 60000, 1, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('6d4e2e77-25b1-47df-a0ca-1bc65158da43', 'AEK-201-MC', 'Mercedes-Benz', 'Actros 3354 6x4', 2023, 'EM_VIAGEM', 105400, 110000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('c8cc337f-1cc5-4a12-9c12-74820ed74f56', 'ADZ-990-MC', 'MAN', 'TGX 26.540 6x4', 2024, 'EM_VIAGEM', 67300, 75000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('6a3a20d1-01b8-4a3e-8f04-0893bcad1a56', 'AHB-405-MC', 'Volvo', 'FMX 460 Dump Truck', 2024, 'MANUTENCAO', 142000, 140000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('26d1af0c-3159-423c-88bd-8275c277ea02', 'AIC-772-MC', 'Scania', 'G460 Heavy Hauler', 2025, 'OPERACIONAL', 28900, 40000, 1, NOW(), NOW());

-- Tabela `drivers`
CREATE TABLE IF NOT EXISTS `drivers` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `licenseNumber` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'DISPONIVEL',
  `isAvailable` TINYINT(1) NOT NULL DEFAULT 1,
  `deletedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('171a8de7-6b2a-44ae-9b60-848311231dc0', 'João Mucavel', 'C-901823', '+258 84 901 8822', 'EM_VIAGEM', 0, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('1e628a1c-c3ec-4d20-babc-053086e014ca', 'Mateus Sitoe', 'C-445129', '+258 82 445 1199', 'EM_VIAGEM', 0, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('3bdefdaf-5dc6-41df-9bca-6975f628a728', 'Carlos Alberto Nhantumbo', 'C-772910', '+258 84 772 9900', 'DISPONIVEL', 1, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('5222eb7b-29b6-4c80-b0cc-b0253337bee6', 'Paulo Mondlane', 'C-338192', '+258 86 338 1900', 'EM_VIAGEM', 0, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('365700bc-ac8d-44c6-b21c-cd2f741f4101', 'Bernardo Cossa', 'C-551029', '+258 84 551 0022', 'EM_VIAGEM', 0, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('a717311f-994e-4e37-a5f8-4f55d1e843e7', 'Tomas Macamo', 'C-882019', '+258 82 882 0111', 'DISPONIVEL', 1, NOW(), NOW());

-- Tabela `routes`
CREATE TABLE IF NOT EXISTS `routes` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `origin` VARCHAR(191) NOT NULL,
  `destination` VARCHAR(191) NOT NULL,
  `distanceKm` DOUBLE NOT NULL,
  `estDurationHours` DOUBLE NOT NULL,
  `borderCheckpoints` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('f8eaa807-f8c1-46da-990d-d68ddff39c21', 'Maputo ➔ Nampula (Corredor N1)', 'Maputo', 'Nampula', 2150, 36, 'N/A (Nacional)', NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('d6a09608-c9d8-41d9-be99-0e585efff052', 'Beira ➔ Lilongwe (Malawi)', 'Beira', 'Lilongwe (Malawi)', 950, 20, 'Fronteira de Cuchamano / Zóbuè', NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('0edd8661-2ec5-4ac8-a0a3-f6f643c3cc37', 'Nacala ➔ Blantyre (Corredor de Nacala)', 'Nacala', 'Blantyre (Malawi)', 820, 16, 'Fronteira de Entre-Lagos', NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('c43638ba-4c67-4432-9745-88068b044fe7', 'Pemba ➔ Palma (Projecto Gás LNG)', 'Pemba', 'Palma (Afungi)', 410, 8, 'N/A (Nacional)', NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('2a5a3c32-5319-49d9-8872-ff5e0c50746e', 'Tete ➔ Beira (Corredor do Carvão)', 'Moatize (Tete)', 'Porto da Beira', 590, 11, 'N/A (Nacional)', NOW());


CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `nuit` VARCHAR(191) NULL,
  `isCorporate` TINYINT(1) NOT NULL DEFAULT 1,
  `status` VARCHAR(191) NOT NULL DEFAULT 'ATIVO',
  `deletedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `customers_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `employees` (
  `id` VARCHAR(191) NOT NULL,
  `branchId` VARCHAR(191) NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(191) NULL,
  `position` VARCHAR(191) NOT NULL,
  `department` VARCHAR(191) NULL,
  `salary` DOUBLE NULL,
  `hireDate` DATETIME(3) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `employees_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `companyName` VARCHAR(191) NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `origin` VARCHAR(191) NOT NULL,
  `destination` VARCHAR(191) NOT NULL,
  `cargoType` VARCHAR(191) NOT NULL,
  `estimatedWeight` DOUBLE NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'NOVO',
  `customerId` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `leads_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `quotations` (
  `id` VARCHAR(191) NOT NULL,
  `quotationNumber` VARCHAR(191) NOT NULL UNIQUE,
  `customerId` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NULL,
  `leadId` VARCHAR(191) NULL,
  `origin` VARCHAR(191) NOT NULL,
  `destination` VARCHAR(191) NOT NULL,
  `cargoDescription` TEXT NOT NULL,
  `weightKg` DOUBLE NOT NULL,
  `containerSize` VARCHAR(191) NULL,
  `priceSubtotal` DOUBLE NOT NULL,
  `taxAmount` DOUBLE NOT NULL,
  `totalPrice` DOUBLE NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'MZN',
  `validUntil` DATETIME(3) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'RASCUNHO',
  `createdById` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `quotations_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`),
  CONSTRAINT `quotations_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`),
  CONSTRAINT `quotations_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contracts` (
  `id` VARCHAR(191) NOT NULL,
  `contractNumber` VARCHAR(191) NOT NULL UNIQUE,
  `quotationId` VARCHAR(191) NOT NULL,
  `customerId` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NULL,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NOT NULL,
  `totalAmount` DOUBLE NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'ATIVO',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `contracts_quotationId_fkey` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`),
  CONSTRAINT `contracts_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`),
  CONSTRAINT `contracts_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(191) NOT NULL,
  `bookingNumber` VARCHAR(191) NOT NULL UNIQUE,
  `customerId` VARCHAR(191) NULL,
  `origin` VARCHAR(191) NOT NULL,
  `destination` VARCHAR(191) NOT NULL,
  `cargoDetails` TEXT NULL,
  `scheduledDate` DATETIME(3) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
  `totalPrice` DOUBLE NOT NULL DEFAULT 0.0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `bookings_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cargos` (
  `id` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `weightKg` DOUBLE NOT NULL,
  `volumeM3` DOUBLE NULL,
  `containerNo` VARCHAR(191) NULL,
  `isHazardous` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `trips` (
  `id` VARCHAR(191) NOT NULL,
  `tripNumber` VARCHAR(191) NOT NULL UNIQUE,
  `contractId` VARCHAR(191) NULL,
  `routeId` VARCHAR(191) NULL,
  `vehicleId` VARCHAR(191) NULL,
  `driverId` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'RASCUNHO',
  `departureTime` DATETIME(3) NULL,
  `arrivalTime` DATETIME(3) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `trips_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trips_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `routes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trips_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trips_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `shipments` (
  `id` VARCHAR(191) NOT NULL,
  `tripId` VARCHAR(191) NOT NULL,
  `cargoId` VARCHAR(191) NOT NULL,
  `origin` VARCHAR(191) NOT NULL,
  `destination` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `shipments_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shipments_cargoId_fkey` FOREIGN KEY (`cargoId`) REFERENCES `cargos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fuel_logs` (
  `id` VARCHAR(191) NOT NULL,
  `vehicleId` VARCHAR(191) NOT NULL,
  `driverId` VARCHAR(191) NULL,
  `liters` DOUBLE NOT NULL,
  `pricePerLiter` DOUBLE NOT NULL,
  `totalCost` DOUBLE NOT NULL,
  `odometerKm` DOUBLE NOT NULL,
  `fuelStation` VARCHAR(191) NULL,
  `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fuel_logs_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fuel_logs_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `maintenances` (
  `id` VARCHAR(191) NOT NULL,
  `vehicleId` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `cost` DOUBLE NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'AGENDADO',
  `scheduledDate` DATETIME(3) NOT NULL,
  `completedDate` DATETIME(3) NULL,
  `workshop` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `maintenances_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `invoices` (
  `id` VARCHAR(191) NOT NULL,
  `invoiceNumber` VARCHAR(191) NOT NULL UNIQUE,
  `tripId` VARCHAR(191) NULL,
  `customerId` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NULL,
  `subtotal` DOUBLE NOT NULL,
  `taxAmount` DOUBLE NOT NULL,
  `totalAmount` DOUBLE NOT NULL,
  `paidAmount` DOUBLE NOT NULL DEFAULT 0.0,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'MZN',
  `dueDate` DATETIME(3) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
  `deletedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `invoices_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoices_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`),
  CONSTRAINT `invoices_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `invoice_items` (
  `id` VARCHAR(191) NOT NULL,
  `invoiceId` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `quantity` DOUBLE NOT NULL DEFAULT 1.0,
  `unitPrice` DOUBLE NOT NULL,
  `totalPrice` DOUBLE NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `invoice_items_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(191) NOT NULL,
  `paymentNumber` VARCHAR(191) NOT NULL UNIQUE,
  `invoiceId` VARCHAR(191) NOT NULL,
  `customerId` VARCHAR(191) NULL,
  `amount` DOUBLE NOT NULL,
  `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'TRANSFERENCIA_BANCARIA',
  `referenceNo` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `payments_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `payments_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `expenses` (
  `id` VARCHAR(191) NOT NULL,
  `tripId` VARCHAR(191) NULL,
  `vehicleId` VARCHAR(191) NULL,
  `category` VARCHAR(191) NOT NULL DEFAULT 'COMBUSTIVEL',
  `description` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `receiptNo` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `expenses_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `expenses_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `nuit` VARCHAR(191) NULL UNIQUE,
  `email` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NULL,
  `address` VARCHAR(191) NULL,
  `category` VARCHAR(191) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stock` (
  `id` VARCHAR(191) NOT NULL,
  `supplierId` VARCHAR(191) NULL,
  `code` VARCHAR(191) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(191) NOT NULL DEFAULT 'PECAS',
  `quantity` INT NOT NULL DEFAULT 0,
  `minQuantity` INT NOT NULL DEFAULT 5,
  `unitPrice` DOUBLE NOT NULL DEFAULT 0.0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `stock_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stock_movements` (
  `id` VARCHAR(191) NOT NULL,
  `stockId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL,
  `reference` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `stock_movements_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `stock` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `title` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'INFO',
  `isRead` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `action` VARCHAR(191) NOT NULL,
  `entity` VARCHAR(191) NOT NULL,
  `entityId` VARCHAR(191) NULL,
  `details` TEXT NULL,
  `ipAddress` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `action` VARCHAR(191) NOT NULL,
  `details` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `token` VARCHAR(500) NOT NULL UNIQUE,
  `refreshToken` VARCHAR(500) NOT NULL UNIQUE,
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` VARCHAR(191) NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `revoked` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL UNIQUE,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `api_tokens` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL UNIQUE,
  `lastUsedAt` DATETIME(3) NULL,
  `expiresAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` VARCHAR(191) NOT NULL,
  `uuid` VARCHAR(191) NOT NULL UNIQUE,
  `connection` VARCHAR(191) NOT NULL,
  `queue` VARCHAR(191) NOT NULL,
  `payload` TEXT NOT NULL,
  `exception` TEXT NOT NULL,
  `failedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `migrations` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `executedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
