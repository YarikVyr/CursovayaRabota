import { Router } from 'express';
import { adminAuthMiddleware } from '../../shared/middlewares/admin-auth.middleware.js';
import { adminUsersController } from './admin-users.controller.js';

const router = Router();

router.use(adminAuthMiddleware);

router.get('/users', adminUsersController.getUsers);
router.get('/users/:userId', adminUsersController.getUserById);

export default router;