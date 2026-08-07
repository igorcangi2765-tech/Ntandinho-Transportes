"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const client_1 = require("@prisma/client");
const finance_service_1 = require("./finance.service");
const prisma = new client_1.PrismaClient();
// Memória de fallback para execução sem base de dados ligada
const mockTrips = [
    {
        id: 'trip_01',
        tripNumber: 'TRIP-2026-901',
        origin: 'Maputo',
        destination: 'Nampula',
        status: 'EM_TRANSITO',
        vehicleId: 'veh_01',
        vehiclePlate: 'ABM-849-MC',
        vehicleModel: 'Volvo FH16 750 HP',
        driverId: 'drv_01',
        driverName: 'João Mucavel',
        cargoDescription: 'Cervejas em Paletes (32 Toneladas)',
        departureTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: 'trip_02',
        tripNumber: 'TRIP-2026-902',
        origin: 'Beira',
        destination: 'Lilongwe (Malawi)',
        status: 'ALOCADO',
        vehicleId: 'veh_02',
        vehiclePlate: 'AFK-302-MC',
        vehicleModel: 'Scania R500 V8',
        driverId: 'drv_02',
        driverName: 'Mateus Sitoe',
        cargoDescription: 'Lingotes de Alumínio (Carga SADC)',
        createdAt: new Date().toISOString(),
    },
];
const mockVehicles = [
    {
        id: 'veh_01',
        plateNumber: 'ABM-849-MC',
        make: 'Volvo',
        model: 'FH16 750 HP',
        year: 2024,
        status: 'EM_VIAGEM',
        mileageKm: 124500,
        isAvailable: false,
    },
    {
        id: 'veh_02',
        plateNumber: 'AFK-302-MC',
        make: 'Scania',
        model: 'R500 V8',
        year: 2023,
        status: 'EM_VIAGEM',
        mileageKm: 88200,
        isAvailable: false,
    },
    {
        id: 'veh_03',
        plateNumber: 'AGG-119-MC',
        make: 'DAF',
        model: 'XF 530',
        year: 2025,
        status: 'OPERACIONAL',
        mileageKm: 45000,
        isAvailable: true,
    },
];
const mockDrivers = [
    {
        id: 'drv_01',
        name: 'João Mucavel',
        licenseNumber: 'C-901823',
        phone: '+258 84 901 8822',
        status: 'EM_VIAGEM',
        isAvailable: false,
    },
    {
        id: 'drv_02',
        name: 'Mateus Sitoe',
        licenseNumber: 'C-445129',
        phone: '+258 82 445 1199',
        status: 'EM_VIAGEM',
        isAvailable: false,
    },
    {
        id: 'drv_03',
        name: 'Carlos Alberto',
        licenseNumber: 'C-772910',
        phone: '+258 84 772 9900',
        status: 'DISPONIVEL',
        isAvailable: true,
    },
];
class TripService {
    /**
     * Obter todas as viagens ativas com dados da frota
     */
    static async getTrips() {
        try {
            const trips = await prisma.trip.findMany({
                include: {
                    vehicle: true,
                    driver: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            return trips;
        }
        catch {
            return mockTrips;
        }
    }
    /**
     * Obter veículos da frota N' Tandinho
     */
    static async getVehicles() {
        try {
            return await prisma.vehicle.findMany({ where: { deletedAt: null } });
        }
        catch {
            return mockVehicles;
        }
    }
    /**
     * Obter motoristas
     */
    static async getDrivers() {
        try {
            return await prisma.driver.findMany({ where: { deletedAt: null } });
        }
        catch {
            return mockDrivers;
        }
    }
    /**
     * Alocar Motorista e Veículo a uma Viagem (Trip lifecycle: Draft/New -> Assigned)
     */
    static async assignDriverAndVehicle(data) {
        const tripNumber = data.tripNumber || `TRIP-2026-${Math.floor(100 + Math.random() * 900)}`;
        try {
            // 1. Criar viagem com estatuto ALOCADO
            const trip = await prisma.trip.create({
                data: {
                    tripNumber,
                    vehicleId: data.vehicleId,
                    driverId: data.driverId,
                    status: 'ALOCADO',
                    notes: data.notes,
                },
            });
            // 2. Atualizar estado do Veículo para EM_VIAGEM
            await prisma.vehicle.update({
                where: { id: data.vehicleId },
                data: { status: 'EM_VIAGEM', isAvailable: false },
            });
            // 3. Atualizar estado do Motorista para EM_VIAGEM
            await prisma.driver.update({
                where: { id: data.driverId },
                data: { status: 'EM_VIAGEM', isAvailable: false },
            });
            return trip;
        }
        catch {
            // Fallback
            const newTrip = {
                id: `trip_${Date.now()}`,
                tripNumber,
                origin: data.origin,
                destination: data.destination,
                status: 'ALOCADO',
                vehicleId: data.vehicleId,
                vehiclePlate: 'AGG-119-MC',
                vehicleModel: 'DAF XF 530',
                driverId: data.driverId,
                driverName: 'Carlos Alberto',
                cargoDescription: data.cargoDescription,
                createdAt: new Date().toISOString(),
            };
            mockTrips.unshift(newTrip);
            return newTrip;
        }
    }
    /**
     * Atualizar Estado da Viagem (Em Trânsito / Concluído)
     */
    static async updateTripStatus(tripId, status) {
        try {
            const updateData = { status };
            if (status === 'EM_TRANSITO')
                updateData.departureTime = new Date();
            if (status === 'CONCLUIDO')
                updateData.arrivalTime = new Date();
            const trip = await prisma.trip.update({
                where: { id: tripId },
                data: updateData,
            });
            // Libertar camião e motorista se concluído
            if (status === 'CONCLUIDO' && trip.vehicleId && trip.driverId) {
                await prisma.vehicle.update({
                    where: { id: trip.vehicleId },
                    data: { status: 'OPERACIONAL', isAvailable: true },
                });
                await prisma.driver.update({
                    where: { id: trip.driverId },
                    data: { status: 'DISPONIVEL', isAvailable: true },
                });
                // REGRA DE NEGÓCIO DA FASE 6: Gerar Fatura Automática
                await finance_service_1.FinanceService.generateInvoiceForTrip({
                    tripId: trip.id,
                    customerId: 'cust_cdm_01',
                    subtotal: 350000,
                    currency: 'MZN',
                }).catch(() => null);
            }
            return trip;
        }
        catch {
            const trip = mockTrips.find((t) => t.id === tripId);
            if (trip) {
                trip.status = status;
                if (status === 'CONCLUIDO') {
                    finance_service_1.FinanceService.generateInvoiceForTrip({
                        tripId,
                        customerId: 'cust_cdm_01',
                        subtotal: 350000,
                        currency: 'MZN',
                    }).catch(() => null);
                }
            }
            return trip;
        }
    }
}
exports.TripService = TripService;
