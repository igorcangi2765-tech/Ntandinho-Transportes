import { Request, Response } from 'express';
import { TripService } from '../services/trip.service';

export class FleetController {
  /**
   * GET /api/admin/fleet/trips
   */
  static async getTrips(req: Request, res: Response) {
    try {
      const trips = await TripService.getTrips();
      return res.json({ success: true, data: trips });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao procurar viagens.' });
    }
  }

  /**
   * GET /api/admin/fleet/vehicles
   */
  static async getVehicles(req: Request, res: Response) {
    try {
      const vehicles = await TripService.getVehicles();
      return res.json({ success: true, data: vehicles });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao listar veículos.' });
    }
  }

  /**
   * GET /api/admin/fleet/drivers
   */
  static async getDrivers(req: Request, res: Response) {
    try {
      const drivers = await TripService.getDrivers();
      return res.json({ success: true, data: drivers });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao listar motoristas.' });
    }
  }

  /**
   * POST /api/admin/fleet/trips/assign
   * Vincula Camião, Motorista e Carga a uma Viagem
   */
  static async assignTrip(req: Request, res: Response) {
    try {
      const { vehicleId, driverId, origin, destination, cargoDescription, notes } = req.body;

      if (!vehicleId || !driverId || !origin || !destination) {
        return res.status(400).json({
          error: 'Campos obrigatórios: vehicleId, driverId, origin, destination.',
        });
      }

      const trip = await TripService.assignDriverAndVehicle({
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
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Falha ao alocar viagem.' });
    }
  }

  /**
   * PATCH /api/admin/fleet/trips/:id/status
   */
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['EM_TRANSITO', 'CONCLUIDO', 'CANCELADO'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido fornecido.' });
      }

      const trip = await TripService.updateTripStatus(id, status);
      return res.json({ success: true, message: `Status alterado para ${status}`, data: trip });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Falha ao atualizar viagem.' });
    }
  }
}
