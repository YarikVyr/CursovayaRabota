import { Router } from 'express';
import { adminAuthMiddleware } from '../../shared/middlewares/admin-auth.middleware.js';
import { adminAuditController } from './admin-audit.controller.js';

const router = Router();

router.use(adminAuthMiddleware);

router.get('/audit', adminAuditController.getAuditLogs);

export default router;