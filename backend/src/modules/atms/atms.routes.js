import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { atmsController } from './atms.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/projects/:projectId/atms', atmsController.createAtm);
router.get('/projects/:projectId/atms', atmsController.getProjectAtms);
router.get('/projects/:projectId/atms/:atmId', atmsController.getAtmById);

router.patch('/projects/:projectId/atms/:atmId', atmsController.updateAtm);
router.patch('/projects/:projectId/atms/:atmId/trash', atmsController.moveAtmToTrash);
router.patch('/projects/:projectId/atms/:atmId/restore', atmsController.restoreAtm);

router.delete('/projects/:projectId/atms/:atmId', atmsController.eraseAtm);

export default router;