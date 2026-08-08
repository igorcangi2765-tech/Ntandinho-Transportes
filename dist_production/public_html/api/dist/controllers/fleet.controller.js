"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetController = void 0;
const trip_service_1 = require("../services/trip.service");
class FleetController {
    /**
     * GET /api/admin/fleet/trips
     */
    static async getTrips(req, res) {
        try {
            const trips = await trip_service_1.TripService.getTrips();
            return res.json({ success: true, data: trips });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao procurar viagens.' });
        }
    }
    /**
     * GET /api/admin/fleet/vehicles
     */
    static async getVehicles(req, res) {
        try {
            const vehicles = await trip_service_1.TripService.getVehicles();
            return res.json({ success: true, data: vehicles });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao listar veículos.' });
        }
    }
    /**
     * GET /api/admin/fleet/drivers
     */
    static async getDrivers(req, res) {
        try {
            const drivers = await trip_service_1.TripService.getDrivers();
            return res.json({ success: true, data: drivers });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Erro ao listar motoristas.' });
        }
    }
    /**
     * POST /api/admin/fleet/trips/assign
     * Vincula Camião, Motorista e Carga a uma Viagem
     */
    static async assignTrip(req, res) {
        try {
            const { vehicleId, driverId, origin, destination, cargoDescription, notes } = req.body;
            if (!vehicleId || !driverId || !origin || !destination) {
                return res.status(400).json({
                    error: 'Campos obrigatórios: vehicleId, driverId, origin, destination.',
                });
            }
            const trip = await trip_service_1.TripService.assignDriverAndVehicle({
                vehicleId,
                driverId,
                origin,
                destination,
                cargoDescription: cargoDescription || 'Carga Geral',
                notes,
            });
            return res.status(201).json({
                success: true,
                message: 'Camião e Motorista alocados à viagem com sucesso.',
                data: trip,
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Falha ao alocar viagem.' });
        }
    }
    /**
     * PATCH /api/admin/fleet/trips/:id/status
     */
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status || !['EM_TRANSITO', 'CONCLUIDO', 'CANCELADO'].includes(status)) {
                return res.status(400).json({ error: 'Status inválido fornecido.' });
            }
            const trip = await trip_service_1.TripService.updateTripStatus(id, status);
            return res.json({ success: true, message: `Status alterado para ${status}`, data: trip });
        }
        catch (err) {
            return res.status(500).json({ error: err.message || 'Falha ao atualizar viagem.' });
        }
    }
}
exports.FleetController = FleetController;
