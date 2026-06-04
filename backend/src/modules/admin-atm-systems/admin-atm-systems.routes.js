import { Router } from 'express';
import { adminAuthMiddleware } from '../../shared/middlewares/admin-auth.middleware.js';
import { adminAtmSystemsController } from './admin-atm-systems.controller.js';

const router = Router();

router.use(adminAuthMiddleware);

router.get('/atm-systems', adminAtmSystemsController.getSystems);
router.post('/atm-systems', adminAtmSystemsController.createSystem);
router.patch('/atm-systems/:systemId', adminAtmSystemsController.updateSystem);
router.delete('/atm-systems/:systemId', adminAtmSystemsController.deleteSystem);

router.post('/atm-systems/:systemId/subsystems', adminAtmSystemsController.createSubsystem);
router.patch('/atm-subsystems/:subsystemId', adminAtmSystemsController.updateSubsystem);
router.delete('/atm-subsystems/:subsystemId', adminAtmSystemsController.deleteSubsystem);

export default router;