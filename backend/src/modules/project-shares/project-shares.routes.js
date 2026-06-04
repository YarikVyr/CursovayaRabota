import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { projectSharesController } from './project-shares.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/projects/:projectId/share', projectSharesController.shareProject);
router.get('/projects/:projectId/shares', projectSharesController.getProjectShares);
router.delete('/projects/:projectId/shares/:shareId', projectSharesController.revokeProjectShare);

export default router;