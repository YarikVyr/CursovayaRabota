import { Router } from 'express';
import { adminAuthController } from './admin-auth.controller.js';
import { adminAuthMiddleware } from '../../shared/middlewares/admin-auth.middleware.js';

const router = Router();

router.post('/login', adminAuthController.login);

router.get('/me', adminAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    data: req.admin,
  });
});

export default router;