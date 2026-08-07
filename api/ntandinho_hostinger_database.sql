CREATE TABLE `users` (
`id` VARCHAR(191) NOT NULL,
`email` VARCHAR(191) NOT NULL,
`password` VARCHAR(191) NOT NULL,
`name` VARCHAR(191) NOT NULL,
`phone` VARCHAR(191) NULL,
`roleId` VARCHAR(191) NOT NULL,
`isActive` BOOLEAN NOT NULL DEFAULT true,
`deletedAt` DATETIME(3) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `users_email_key`(`email`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `roles` (
`id` VARCHAR(191) NOT NULL,
`name` VARCHAR(191) NOT NULL,
`description` VARCHAR(191) NULL,
`isSystem` BOOLEAN NOT NULL DEFAULT false,
`deletedAt` DATETIME(3) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `roles_name_key`(`name`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `permissions` (
`id` VARCHAR(191) NOT NULL,
`action` VARCHAR(191) NOT NULL,
`resource` VARCHAR(191) NOT NULL,
`description` VARCHAR(191) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `permissions_action_resource_key`(`action`, `resource`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `role_permissions` (
`roleId` VARCHAR(191) NOT NULL,
`permissionId` VARCHAR(191) NOT NULL,
PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `sessions` (
`id` VARCHAR(191) NOT NULL,
`userId` VARCHAR(191) NOT NULL,
`token` VARCHAR(500) NOT NULL,
`refreshToken` VARCHAR(500) NOT NULL,
`ipAddress` VARCHAR(191) NULL,
`userAgent` VARCHAR(191) NULL,
`expiresAt` DATETIME(3) NOT NULL,
`revoked` BOOLEAN NOT NULL DEFAULT false,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `sessions_token_key`(`token`),
UNIQUE INDEX `sessions_refreshToken_key`(`refreshToken`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `audit_logs` (
`id` VARCHAR(191) NOT NULL,
`userId` VARCHAR(191) NULL,
`action` VARCHAR(191) NOT NULL,
`entity` VARCHAR(191) NOT NULL,
`entityId` VARCHAR(191) NULL,
`details` TEXT NULL,
`ipAddress` VARCHAR(191) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `companies` (
`id` VARCHAR(191) NOT NULL,
`name` VARCHAR(191) NOT NULL,
`nuit` VARCHAR(191) NOT NULL,
`email` VARCHAR(191) NOT NULL,
`phone` VARCHAR(191) NOT NULL,
`address` VARCHAR(191) NULL,
`city` VARCHAR(191) NULL,
`country` VARCHAR(191) NOT NULL DEFAULT 'Mo├ºambique',
`creditLimit` DOUBLE NOT NULL DEFAULT 0.0,
`deletedAt` DATETIME(3) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `companies_nuit_key`(`nuit`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `customers` (
`id` VARCHAR(191) NOT NULL,
`companyId` VARCHAR(191) NULL,
`name` VARCHAR(191) NOT NULL,
`email` VARCHAR(191) NOT NULL,
`phone` VARCHAR(191) NOT NULL,
`nuit` VARCHAR(191) NULL,
`isCorporate` BOOLEAN NOT NULL DEFAULT true,
`status` VARCHAR(191) NOT NULL DEFAULT 'ATIVO',
`deletedAt` DATETIME(3) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `contacts` (
`id` VARCHAR(191) NOT NULL,
`companyId` VARCHAR(191) NOT NULL,
`name` VARCHAR(191) NOT NULL,
`position` VARCHAR(191) NULL,
`email` VARCHAR(191) NOT NULL,
`phone` VARCHAR(191) NOT NULL,
`isPrimary` BOOLEAN NOT NULL DEFAULT false,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `leads` (
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
`updatedAt` DATETIME(3) NOT NULL,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `quotations` (
`id` VARCHAR(191) NOT NULL,
`quotationNumber` VARCHAR(191) NOT NULL,
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
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `quotations_quotationNumber_key`(`quotationNumber`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `contracts` (
`id` VARCHAR(191) NOT NULL,
`contractNumber` VARCHAR(191) NOT NULL,
`quotationId` VARCHAR(191) NOT NULL,
`customerId` VARCHAR(191) NOT NULL,
`companyId` VARCHAR(191) NULL,
`startDate` DATETIME(3) NOT NULL,
`endDate` DATETIME(3) NOT NULL,
`totalAmount` DOUBLE NOT NULL,
`status` VARCHAR(191) NOT NULL DEFAULT 'ATIVO',
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `contracts_contractNumber_key`(`contractNumber`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `vehicles` (
`id` VARCHAR(191) NOT NULL,
`plateNumber` VARCHAR(191) NOT NULL,
`make` VARCHAR(191) NOT NULL,
`model` VARCHAR(191) NOT NULL,
`year` INTEGER NOT NULL,
`status` VARCHAR(191) NOT NULL DEFAULT 'OPERACIONAL',
`mileageKm` DOUBLE NOT NULL DEFAULT 0.0,
`nextServiceKm` DOUBLE NULL,
`licenseExpiry` DATETIME(3) NULL,
`isAvailable` BOOLEAN NOT NULL DEFAULT true,
`deletedAt` DATETIME(3) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `vehicles_plateNumber_key`(`plateNumber`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `drivers` (
`id` VARCHAR(191) NOT NULL,
`name` VARCHAR(191) NOT NULL,
`licenseNumber` VARCHAR(191) NOT NULL,
`phone` VARCHAR(191) NOT NULL,
`status` VARCHAR(191) NOT NULL DEFAULT 'DISPONIVEL',
`isAvailable` BOOLEAN NOT NULL DEFAULT true,
`deletedAt` DATETIME(3) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `drivers_licenseNumber_key`(`licenseNumber`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `routes` (
`id` VARCHAR(191) NOT NULL,
`name` VARCHAR(191) NOT NULL,
`origin` VARCHAR(191) NOT NULL,
`destination` VARCHAR(191) NOT NULL,
`distanceKm` DOUBLE NOT NULL,
`estDurationHours` DOUBLE NOT NULL,
`borderCheckpoints` VARCHAR(191) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `cargos` (
`id` VARCHAR(191) NOT NULL,
`description` TEXT NOT NULL,
`weightKg` DOUBLE NOT NULL,
`volumeM3` DOUBLE NULL,
`containerNo` VARCHAR(191) NULL,
`isHazardous` BOOLEAN NOT NULL DEFAULT false,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `trips` (
`id` VARCHAR(191) NOT NULL,
`tripNumber` VARCHAR(191) NOT NULL,
`contractId` VARCHAR(191) NULL,
`routeId` VARCHAR(191) NULL,
`vehicleId` VARCHAR(191) NULL,
`driverId` VARCHAR(191) NULL,
`status` VARCHAR(191) NOT NULL DEFAULT 'RASCUNHO',
`departureTime` DATETIME(3) NULL,
`arrivalTime` DATETIME(3) NULL,
`notes` TEXT NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `trips_tripNumber_key`(`tripNumber`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `shipments` (
`id` VARCHAR(191) NOT NULL,
`tripId` VARCHAR(191) NOT NULL,
`cargoId` VARCHAR(191) NOT NULL,
`origin` VARCHAR(191) NOT NULL,
`destination` VARCHAR(191) NOT NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `maintenances` (
`id` VARCHAR(191) NOT NULL,
`vehicleId` VARCHAR(191) NOT NULL,
`description` TEXT NOT NULL,
`cost` DOUBLE NOT NULL,
`status` VARCHAR(191) NOT NULL DEFAULT 'AGENDADO',
`scheduledDate` DATETIME(3) NOT NULL,
`completedDate` DATETIME(3) NULL,
`workshop` VARCHAR(191) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` DATETIME(3) NOT NULL,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `invoices` (
`id` VARCHAR(191) NOT NULL,
`invoiceNumber` VARCHAR(191) NOT NULL,
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
`updatedAt` DATETIME(3) NOT NULL,
UNIQUE INDEX `invoices_invoiceNumber_key`(`invoiceNumber`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `invoice_items` (
`id` VARCHAR(191) NOT NULL,
`invoiceId` VARCHAR(191) NOT NULL,
`description` VARCHAR(191) NOT NULL,
`quantity` DOUBLE NOT NULL DEFAULT 1.0,
`unitPrice` DOUBLE NOT NULL,
`totalPrice` DOUBLE NOT NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `payments` (
`id` VARCHAR(191) NOT NULL,
`paymentNumber` VARCHAR(191) NOT NULL,
`invoiceId` VARCHAR(191) NOT NULL,
`customerId` VARCHAR(191) NULL,
`amount` DOUBLE NOT NULL,
`paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'TRANSFERENCIA_BANCARIA',
`referenceNo` VARCHAR(191) NULL,
`notes` TEXT NULL,
`paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `payments_paymentNumber_key`(`paymentNumber`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `expenses` (
`id` VARCHAR(191) NOT NULL,
`tripId` VARCHAR(191) NULL,
`vehicleId` VARCHAR(191) NULL,
`category` VARCHAR(191) NOT NULL DEFAULT 'COMBUSTIVEL',
`description` VARCHAR(191) NOT NULL,
`amount` DOUBLE NOT NULL,
`date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`receiptNo` VARCHAR(191) NULL,
`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `customers` ADD CONSTRAINT `customers_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `leads` ADD CONSTRAINT `leads_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `quotations` ADD CONSTRAINT `quotations_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `quotations` ADD CONSTRAINT `quotations_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `quotations` ADD CONSTRAINT `quotations_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `quotations` ADD CONSTRAINT `quotations_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_quotationId_fkey` FOREIGN KEY (`quotationId`) REFERENCES `quotations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `trips` ADD CONSTRAINT `trips_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `trips` ADD CONSTRAINT `trips_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `routes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `trips` ADD CONSTRAINT `trips_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `trips` ADD CONSTRAINT `trips_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `shipments` ADD CONSTRAINT `shipments_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `shipments` ADD CONSTRAINT `shipments_cargoId_fkey` FOREIGN KEY (`cargoId`) REFERENCES `cargos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `maintenances` ADD CONSTRAINT `maintenances_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `invoice_items` ADD CONSTRAINT `invoice_items_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `payments` ADD CONSTRAINT `payments_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `payments` ADD CONSTRAINT `payments_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

INSERT IGNORE INTO `roles` (`id`, `name`, `description`, `isSystem`, `createdAt`, `updatedAt`) VALUES ('f670c9ef-c4f5-43fe-8d38-3451c41118e2', 'ADMIN', 'Administrador Geral com acesso total ao ERP', 1, NOW(), NOW());
INSERT IGNORE INTO `permissions` (`id`, `action`, `resource`, `description`, `createdAt`) VALUES ('b9091adb-f20c-45c0-bbe6-dc83eb641899', '*', '*', 'Acesso total a todos os recursos', NOW());
INSERT IGNORE INTO `role_permissions` (`roleId`, `permissionId`) VALUES ('f670c9ef-c4f5-43fe-8d38-3451c41118e2', 'b9091adb-f20c-45c0-bbe6-dc83eb641899');
INSERT IGNORE INTO `users` (`id`, `email`, `password`, `name`, `phone`, `roleId`, `isActive`, `createdAt`, `updatedAt`) VALUES ('7f173bc4-672b-49dc-83cd-aaf362b1d5c5', 'admin@ntandinho.co.mz', '$2a$10$liHstyKSwoe5TlvlH2qCXupoR03ZJYleO6BKVYz6/QzMkCkYYOZL2', 'Administrador N'' Tandinho', NULL, 'f670c9ef-c4f5-43fe-8d38-3451c41118e2', 1, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('c3ab3e2c-eb94-4db2-9b5e-69ea78b4f43e', 'Cervejas de Moçambique (CDM S.A.)', '400192834', 'logistica@cdm.co.mz', '+258 21 480 100', 'Av. 25 de Setembro, Nº 1020', 'Maputo', 'Moçambique', 5000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('059bf6a5-d56f-45a7-985f-3630131a6792', 'Mozal S.A.', '400551920', 'supply@mozal.com', '+258 21 720 000', 'Parque Industrial de Beluluane', 'Matola', 'Moçambique', 10000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('48e4eaf8-8f7d-4e3c-aa25-f1b5c7b45bf5', 'Vulcan Minerals Moçambique', '400998811', 'transporte@vulcan.co.mz', '+258 25 220 900', 'Mina de Carvão de Moatize', 'Tete', 'Moçambique', 8000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('10e6841e-01a9-42d7-8d8c-94489a90a4a5', 'Coca-Cola Sabco Moçambique', '400281920', 'expedicao@cocacola.co.mz', '+258 21 720 300', 'Bairro da Machava', 'Matola', 'Moçambique', 4000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('d7cfcf12-760d-43f8-8fc5-ad18ae2e7ea9', 'Cimentos de Moçambique S.A.', '400334812', 'distribuicao@cimentos.co.mz', '+258 21 350 200', 'Fábrica da Matola', 'Matola', 'Moçambique', 6000000, NOW(), NOW());
INSERT IGNORE INTO `companies` (`id`, `name`, `nuit`, `email`, `phone`, `address`, `city`, `country`, `creditLimit`, `createdAt`, `updatedAt`) VALUES ('404bc95b-4fdc-47b9-99aa-3ecb5191c223', 'Fazendas Agrícolas de Nampula Lda', '400551928', 'compras@fazendasnampula.co.mz', '+258 26 218 440', 'Estrada Nacional N1, Km 12', 'Nampula', 'Moçambique', 2500000, NOW(), NOW());
INSERT IGNORE INTO `customers` (`id`, `companyId`, `name`, `email`, `phone`, `nuit`, `isCorporate`, `status`, `createdAt`, `updatedAt`) VALUES ('b6647e5c-dbb3-4f23-a546-9457bd1b7738', 'c3ab3e2c-eb94-4db2-9b5e-69ea78b4f43e', 'Cervejas de Moçambique (CDM S.A.)', 'logistica@cdm.co.mz', '+258 21 480 100', '400192834', 1, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `customers` (`id`, `companyId`, `name`, `email`, `phone`, `nuit`, `isCorporate`, `status`, `createdAt`, `updatedAt`) VALUES ('419f159c-c770-46de-bc74-eecf6f9ee248', '059bf6a5-d56f-45a7-985f-3630131a6792', 'Mozal S.A.', 'supply@mozal.com', '+258 21 720 000', '400551920', 1, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `customers` (`id`, `companyId`, `name`, `email`, `phone`, `nuit`, `isCorporate`, `status`, `createdAt`, `updatedAt`) VALUES ('6532748a-6779-4d6e-a91a-4716a97622df', '48e4eaf8-8f7d-4e3c-aa25-f1b5c7b45bf5', 'Vulcan Minerals Moçambique', 'transporte@vulcan.co.mz', '+258 25 220 900', '400998811', 1, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `customers` (`id`, `companyId`, `name`, `email`, `phone`, `nuit`, `isCorporate`, `status`, `createdAt`, `updatedAt`) VALUES ('18618383-e8c6-4bd7-bb7d-b8c11a65795c', '10e6841e-01a9-42d7-8d8c-94489a90a4a5', 'Coca-Cola Sabco Moçambique', 'expedicao@cocacola.co.mz', '+258 21 720 300', '400281920', 1, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `customers` (`id`, `companyId`, `name`, `email`, `phone`, `nuit`, `isCorporate`, `status`, `createdAt`, `updatedAt`) VALUES ('eecbecb5-8ef9-4874-9a4f-e36a4f3799e0', 'd7cfcf12-760d-43f8-8fc5-ad18ae2e7ea9', 'Cimentos de Moçambique S.A.', 'distribuicao@cimentos.co.mz', '+258 21 350 200', '400334812', 1, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `customers` (`id`, `companyId`, `name`, `email`, `phone`, `nuit`, `isCorporate`, `status`, `createdAt`, `updatedAt`) VALUES ('af536d2a-dcf7-4302-aadb-0891c0d9423e', '404bc95b-4fdc-47b9-99aa-3ecb5191c223', 'Fazendas Agrícolas de Nampula Lda', 'compras@fazendasnampula.co.mz', '+258 26 218 440', '400551928', 1, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('df7af95b-3ee7-4001-9a06-f262880d31ba', 'ABM-849-MC', 'Volvo', 'FH16 750 HP (3 Eixos)', 2024, 'EM_VIAGEM', 124500, 130000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('f3f4815b-53fc-465e-895b-01210e9f8a3d', 'AFK-302-MC', 'Scania', 'R500 V8 Streamline', 2023, 'EM_VIAGEM', 88200, 95000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('63ddc336-cf58-4436-83e5-c09ad7dfe364', 'AGG-119-MC', 'DAF', 'XF 530 Super Space Cab', 2025, 'OPERACIONAL', 45000, 60000, 1, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('6d4e2e77-25b1-47df-a0ca-1bc65158da43', 'AEK-201-MC', 'Mercedes-Benz', 'Actros 3354 6x4', 2023, 'EM_VIAGEM', 105400, 110000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('c8cc337f-1cc5-4a12-9c12-74820ed74f56', 'ADZ-990-MC', 'MAN', 'TGX 26.540 6x4', 2024, 'EM_VIAGEM', 67300, 75000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('6a3a20d1-01b8-4a3e-8f04-0893bcad1a56', 'AHB-405-MC', 'Volvo', 'FMX 460 Dump Truck', 2024, 'MANUTENCAO', 142000, 140000, 0, NOW(), NOW());
INSERT IGNORE INTO `vehicles` (`id`, `plateNumber`, `make`, `model`, `year`, `status`, `mileageKm`, `nextServiceKm`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('26d1af0c-3159-423c-88bd-8275c277ea02', 'AIC-772-MC', 'Scania', 'G460 Heavy Hauler', 2025, 'OPERACIONAL', 28900, 40000, 1, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('171a8de7-6b2a-44ae-9b60-848311231dc0', 'João Mucavel', 'C-901823', '+258 84 901 8822', 'EM_VIAGEM', 0, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('1e628a1c-c3ec-4d20-babc-053086e014ca', 'Mateus Sitoe', 'C-445129', '+258 82 445 1199', 'EM_VIAGEM', 0, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('3bdefdaf-5dc6-41df-9bca-6975f628a728', 'Carlos Alberto Nhantumbo', 'C-772910', '+258 84 772 9900', 'DISPONIVEL', 1, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('5222eb7b-29b6-4c80-b0cc-b0253337bee6', 'Paulo Mondlane', 'C-338192', '+258 86 338 1900', 'EM_VIAGEM', 0, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('365700bc-ac8d-44c6-b21c-cd2f741f4101', 'Bernardo Cossa', 'C-551029', '+258 84 551 0022', 'EM_VIAGEM', 0, NOW(), NOW());
INSERT IGNORE INTO `drivers` (`id`, `name`, `licenseNumber`, `phone`, `status`, `isAvailable`, `createdAt`, `updatedAt`) VALUES ('a717311f-994e-4e37-a5f8-4f55d1e843e7', 'Tomas Macamo', 'C-882019', '+258 82 882 0111', 'DISPONIVEL', 1, NOW(), NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('f8eaa807-f8c1-46da-990d-d68ddff39c21', 'Maputo ➔ Nampula (Corredor N1)', 'Maputo', 'Nampula', 2150, 36, 'N/A (Nacional)', NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('d6a09608-c9d8-41d9-be99-0e585efff052', 'Beira ➔ Lilongwe (Malawi)', 'Beira', 'Lilongwe (Malawi)', 950, 20, 'Fronteira de Cuchamano / Zóbuè', NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('0edd8661-2ec5-4ac8-a0a3-f6f643c3cc37', 'Nacala ➔ Blantyre (Corredor de Nacala)', 'Nacala', 'Blantyre (Malawi)', 820, 16, 'Fronteira de Entre-Lagos', NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('c43638ba-4c67-4432-9745-88068b044fe7', 'Pemba ➔ Palma (Projecto Gás LNG)', 'Pemba', 'Palma (Afungi)', 410, 8, 'N/A (Nacional)', NOW());
INSERT IGNORE INTO `routes` (`id`, `name`, `origin`, `destination`, `distanceKm`, `estDurationHours`, `borderCheckpoints`, `createdAt`) VALUES ('2a5a3c32-5319-49d9-8872-ff5e0c50746e', 'Tete ➔ Beira (Corredor do Carvão)', 'Moatize (Tete)', 'Porto da Beira', 590, 11, 'N/A (Nacional)', NOW());
INSERT IGNORE INTO `quotations` (`id`, `quotationNumber`, `customerId`, `companyId`, `origin`, `destination`, `cargoDescription`, `weightKg`, `priceSubtotal`, `taxAmount`, `totalPrice`, `currency`, `validUntil`, `status`, `createdAt`, `updatedAt`) VALUES ('10a88392-e6e8-472a-ad72-65ad409294f4', 'COT-2026-001', 'b6647e5c-dbb3-4f23-a546-9457bd1b7738', 'c3ab3e2c-eb94-4db2-9b5e-69ea78b4f43e', 'Maputo', 'Nampula', 'Paletes de Cerveja e Refrigerantes (Container 40ft)', 28000, 350000, 56000, 406000, 'MZN', NOW(), 'APROVADA', NOW(), NOW());
INSERT IGNORE INTO `quotations` (`id`, `quotationNumber`, `customerId`, `companyId`, `origin`, `destination`, `cargoDescription`, `weightKg`, `priceSubtotal`, `taxAmount`, `totalPrice`, `currency`, `validUntil`, `status`, `createdAt`, `updatedAt`) VALUES ('cde018cc-ac1b-45d9-9459-67361ecb8fe4', 'COT-2026-002', '419f159c-c770-46de-bc74-eecf6f9ee248', '059bf6a5-d56f-45a7-985f-3630131a6792', 'Beira', 'Lilongwe (Malawi)', 'Lingotes de Alumínio Exportação (Carga SADC)', 32000, 520000, 83200, 603200, 'MZN', NOW(), 'APROVADA', NOW(), NOW());
INSERT IGNORE INTO `quotations` (`id`, `quotationNumber`, `customerId`, `companyId`, `origin`, `destination`, `cargoDescription`, `weightKg`, `priceSubtotal`, `taxAmount`, `totalPrice`, `currency`, `validUntil`, `status`, `createdAt`, `updatedAt`) VALUES ('0a897bfa-f003-4d2a-bf46-13587ed3674e', 'COT-2026-003', '6532748a-6779-4d6e-a91a-4716a97622df', '48e4eaf8-8f7d-4e3c-aa25-f1b5c7b45bf5', 'Moatize (Tete)', 'Porto da Beira', 'Equipamento Industrial de Mineração', 40000, 480000, 76800, 556800, 'MZN', NOW(), 'ENVIADA', NOW(), NOW());
INSERT IGNORE INTO `quotations` (`id`, `quotationNumber`, `customerId`, `companyId`, `origin`, `destination`, `cargoDescription`, `weightKg`, `priceSubtotal`, `taxAmount`, `totalPrice`, `currency`, `validUntil`, `status`, `createdAt`, `updatedAt`) VALUES ('dfd9ffe8-b1bf-4a85-a3b0-5172be0c34e3', 'COT-2026-004', 'eecbecb5-8ef9-4874-9a4f-e36a4f3799e0', 'd7cfcf12-760d-43f8-8fc5-ad18ae2e7ea9', 'Matola', 'Nampula', 'Sacos de Cimento Portland (Carga a Granel 34T)', 34000, 380000, 60800, 440800, 'MZN', NOW(), 'APROVADA', NOW(), NOW());
INSERT IGNORE INTO `contracts` (`id`, `contractNumber`, `quotationId`, `customerId`, `companyId`, `startDate`, `endDate`, `totalAmount`, `status`, `createdAt`, `updatedAt`) VALUES ('5702e0ef-865b-40ba-a26e-8637af911576', 'CTR-2026-101', '10a88392-e6e8-472a-ad72-65ad409294f4', 'b6647e5c-dbb3-4f23-a546-9457bd1b7738', 'c3ab3e2c-eb94-4db2-9b5e-69ea78b4f43e', NOW(), NOW(), 4860000, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `contracts` (`id`, `contractNumber`, `quotationId`, `customerId`, `companyId`, `startDate`, `endDate`, `totalAmount`, `status`, `createdAt`, `updatedAt`) VALUES ('61a7b83d-dd15-4377-8ca6-23aa5cfe0ae1', 'CTR-2026-102', 'cde018cc-ac1b-45d9-9459-67361ecb8fe4', '419f159c-c770-46de-bc74-eecf6f9ee248', '059bf6a5-d56f-45a7-985f-3630131a6792', NOW(), NOW(), 7238000, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `contracts` (`id`, `contractNumber`, `quotationId`, `customerId`, `companyId`, `startDate`, `endDate`, `totalAmount`, `status`, `createdAt`, `updatedAt`) VALUES ('e1c80585-0fc7-4259-a6f3-34fee143c580', 'CTR-2026-103', 'dfd9ffe8-b1bf-4a85-a3b0-5172be0c34e3', 'eecbecb5-8ef9-4874-9a4f-e36a4f3799e0', 'd7cfcf12-760d-43f8-8fc5-ad18ae2e7ea9', NOW(), NOW(), 3950000, 'ATIVO', NOW(), NOW());
INSERT IGNORE INTO `trips` (`id`, `tripNumber`, `contractId`, `routeId`, `vehicleId`, `driverId`, `status`, `notes`, `createdAt`, `updatedAt`) VALUES ('d7e4db28-22b5-4e51-958a-ce480799fb3f', 'TRIP-2026-901', '5702e0ef-865b-40ba-a26e-8637af911576', 'f8eaa807-f8c1-46da-990d-d68ddff39c21', 'df7af95b-3ee7-4001-9a06-f262880d31ba', '171a8de7-6b2a-44ae-9b60-848311231dc0', 'EM_TRANSITO', 'Cervejas em Paletes. Camião em rota Nampula->Beira.', NOW(), NOW());
INSERT IGNORE INTO `trips` (`id`, `tripNumber`, `contractId`, `routeId`, `vehicleId`, `driverId`, `status`, `notes`, `createdAt`, `updatedAt`) VALUES ('97a953b8-5563-47e4-ae37-098967fd8439', 'TRIP-2026-902', '61a7b83d-dd15-4377-8ca6-23aa5cfe0ae1', 'd6a09608-c9d8-41d9-be99-0e585efff052', 'f3f4815b-53fc-465e-895b-01210e9f8a3d', '1e628a1c-c3ec-4d20-babc-053086e014ca', 'EM_TRANSITO', 'Lingotes de Alumínio SADC rumo a Lilongwe.', NOW(), NOW());
INSERT IGNORE INTO `trips` (`id`, `tripNumber`, `contractId`, `routeId`, `vehicleId`, `driverId`, `status`, `notes`, `createdAt`, `updatedAt`) VALUES ('9d4356f5-4517-47a0-8160-841fb97d2770', 'TRIP-2026-903', 'e1c80585-0fc7-4259-a6f3-34fee143c580', '0edd8661-2ec5-4ac8-a0a3-f6f643c3cc37', '6d4e2e77-25b1-47df-a0ca-1bc65158da43', '5222eb7b-29b6-4c80-b0cc-b0253337bee6', 'EM_TRANSITO', 'Despacho de Cimento para a Região Norte.', NOW(), NOW());
INSERT IGNORE INTO `trips` (`id`, `tripNumber`, `contractId`, `routeId`, `vehicleId`, `driverId`, `status`, `notes`, `createdAt`, `updatedAt`) VALUES ('3fe75bc5-43ff-45e5-a8ff-6305336af4ed', 'TRIP-2026-904', '5702e0ef-865b-40ba-a26e-8637af911576', 'c43638ba-4c67-4432-9745-88068b044fe7', 'c8cc337f-1cc5-4a12-9c12-74820ed74f56', '365700bc-ac8d-44c6-b21c-cd2f741f4101', 'ALOCADO', 'Aguarda carregamento no Porto de Pemba.', NOW(), NOW());
INSERT IGNORE INTO `trips` (`id`, `tripNumber`, `contractId`, `routeId`, `vehicleId`, `driverId`, `status`, `notes`, `createdAt`, `updatedAt`) VALUES ('4dd83eff-cbcd-48eb-9cae-9c261c825c6c', 'TRIP-2026-880', '61a7b83d-dd15-4377-8ca6-23aa5cfe0ae1', '2a5a3c32-5319-49d9-8872-ff5e0c50746e', '63ddc336-cf58-4436-83e5-c09ad7dfe364', '3bdefdaf-5dc6-41df-9bca-6975f628a728', 'CONCLUIDO', 'Entrega efetuada com sucesso no Porto da Beira.', NOW(), NOW());
INSERT IGNORE INTO `invoices` (`id`, `invoiceNumber`, `tripId`, `customerId`, `companyId`, `subtotal`, `taxAmount`, `totalAmount`, `paidAmount`, `currency`, `dueDate`, `status`, `createdAt`, `updatedAt`) VALUES ('5a75aa59-ebe3-4962-8068-35ae679f1867', 'FT-2026-001', 'd7e4db28-22b5-4e51-958a-ce480799fb3f', 'b6647e5c-dbb3-4f23-a546-9457bd1b7738', 'c3ab3e2c-eb94-4db2-9b5e-69ea78b4f43e', 350000, 56000, 406000, 0, 'MZN', NOW(), 'PENDENTE', NOW(), NOW());
INSERT IGNORE INTO `invoices` (`id`, `invoiceNumber`, `tripId`, `customerId`, `companyId`, `subtotal`, `taxAmount`, `totalAmount`, `paidAmount`, `currency`, `dueDate`, `status`, `createdAt`, `updatedAt`) VALUES ('bde47a01-e934-4476-888a-724532128f64', 'FT-2026-002', '97a953b8-5563-47e4-ae37-098967fd8439', '419f159c-c770-46de-bc74-eecf6f9ee248', '059bf6a5-d56f-45a7-985f-3630131a6792', 520000, 83200, 603200, 603200, 'MZN', NOW(), 'PAGO', NOW(), NOW());
INSERT IGNORE INTO `invoices` (`id`, `invoiceNumber`, `tripId`, `customerId`, `companyId`, `subtotal`, `taxAmount`, `totalAmount`, `paidAmount`, `currency`, `dueDate`, `status`, `createdAt`, `updatedAt`) VALUES ('161f0643-8c7b-4ccc-be62-c05132acb6c3', 'FT-2026-003', '4dd83eff-cbcd-48eb-9cae-9c261c825c6c', '6532748a-6779-4d6e-a91a-4716a97622df', '48e4eaf8-8f7d-4e3c-aa25-f1b5c7b45bf5', 480000, 76800, 556800, 300000, 'MZN', NOW(), 'PAGO_PARCIAL', NOW(), NOW());
INSERT IGNORE INTO `invoices` (`id`, `invoiceNumber`, `tripId`, `customerId`, `companyId`, `subtotal`, `taxAmount`, `totalAmount`, `paidAmount`, `currency`, `dueDate`, `status`, `createdAt`, `updatedAt`) VALUES ('d82506ef-14f4-4d09-9935-beab045d1cf7', 'FT-2026-004', '9d4356f5-4517-47a0-8160-841fb97d2770', 'eecbecb5-8ef9-4874-9a4f-e36a4f3799e0', 'd7cfcf12-760d-43f8-8fc5-ad18ae2e7ea9', 380000, 60800, 440800, 440800, 'MZN', NOW(), 'PAGO', NOW(), NOW());
INSERT IGNORE INTO `payments` (`id`, `paymentNumber`, `invoiceId`, `customerId`, `amount`, `paymentMethod`, `referenceNo`, `paidAt`, `createdAt`) VALUES ('330acd47-e9d4-4d82-9a08-742dbfbe104f', 'REC-2026-001', 'bde47a01-e934-4476-888a-724532128f64', '419f159c-c770-46de-bc74-eecf6f9ee248', 603200, 'TRANSFERENCIA_BANCARIA', 'BVM-90182377', NOW(), NOW());
INSERT IGNORE INTO `payments` (`id`, `paymentNumber`, `invoiceId`, `customerId`, `amount`, `paymentMethod`, `referenceNo`, `paidAt`, `createdAt`) VALUES ('6e64cace-ec30-49b9-899a-9f72f5048138', 'REC-2026-002', '161f0643-8c7b-4ccc-be62-c05132acb6c3', '6532748a-6779-4d6e-a91a-4716a97622df', 300000, 'TRANSFERENCIA_BANCARIA', 'BCI-4491028', NOW(), NOW());
INSERT IGNORE INTO `payments` (`id`, `paymentNumber`, `invoiceId`, `customerId`, `amount`, `paymentMethod`, `referenceNo`, `paidAt`, `createdAt`) VALUES ('f4fb6b2f-5484-444b-a1ae-48bdd21fd1b9', 'REC-2026-003', 'd82506ef-14f4-4d09-9935-beab045d1cf7', 'eecbecb5-8ef9-4874-9a4f-e36a4f3799e0', 440800, 'TRANSFERENCIA_BANCARIA', 'STD-8829102', NOW(), NOW());
INSERT IGNORE INTO `expenses` (`id`, `tripId`, `vehicleId`, `category`, `description`, `amount`, `receiptNo`, `date`, `createdAt`) VALUES ('741279a7-9d83-4408-b33d-f1d6dbc423d6', 'd7e4db28-22b5-4e51-958a-ce480799fb3f', 'df7af95b-3ee7-4001-9a06-f262880d31ba', 'COMBUSTIVEL', 'Abastecimento Diesel 450L em Save', 43650, 'REC-PETROMOC-9921', NOW(), NOW());
INSERT IGNORE INTO `expenses` (`id`, `tripId`, `vehicleId`, `category`, `description`, `amount`, `receiptNo`, `date`, `createdAt`) VALUES ('40ca258e-73a5-4fb9-820c-80ac9cc59d21', '97a953b8-5563-47e4-ae37-098967fd8439', 'f3f4815b-53fc-465e-895b-01210e9f8a3d', 'PORTAGEM', 'Taxa de Portagem e Fronteira Zóbuè', 18500, 'PORT-ZOB-401', NOW(), NOW());
INSERT IGNORE INTO `expenses` (`id`, `tripId`, `vehicleId`, `category`, `description`, `amount`, `receiptNo`, `date`, `createdAt`) VALUES ('e5be2f34-4b22-424a-8954-092af7245f0d', 'd7e4db28-22b5-4e51-958a-ce480799fb3f', 'df7af95b-3ee7-4001-9a06-f262880d31ba', 'SUBSIDIO', 'Subsídio de Viagem e Alimentação Motorista', 15000, 'SUB-JOAO-01', NOW(), NOW());
INSERT IGNORE INTO `expenses` (`id`, `tripId`, `vehicleId`, `category`, `description`, `amount`, `receiptNo`, `date`, `createdAt`) VALUES ('826bed8c-f6e6-49c9-bee9-e25d35403112', NULL, '6a3a20d1-01b8-4a3e-8f04-0893bcad1a56', 'MANUTENCAO', 'Mudança de Óleo, Filtros e Revisão dos Traves', 78000, 'SERV-VOLVO-881', NOW(), NOW());
