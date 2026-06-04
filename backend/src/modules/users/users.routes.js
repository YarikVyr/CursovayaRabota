import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/search-for-share', usersController.searchUserForShare);

export default router;