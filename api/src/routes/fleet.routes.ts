import { Router } from 'express';
import { FleetController } from '../controllers/fleet.controller';
import { requireAuth } from '../middleware/auth.middleware';

const fleetRouter = Router();

fleetRouter.use(requireAuth);

fleetRouter.get('/trips', FleetController.getTrips);
fleetRouter.get('/vehicles', FleetController.getVehicles);
fleetRouter.get('/drivers', FleetController.getDrivers);
fleetRouter.post('/trips/assign', FleetController.assignTrip);
fleetRouter.patch('/trips/:id/status', FleetController.updateStatus);

export default fleetRouter;
