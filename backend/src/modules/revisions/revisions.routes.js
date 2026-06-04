import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { revisionsController } from './revisions.controller.js';

const router = Router();

router.use(authMiddleware);

router.get(
  '/projects/:projectId/atms/:atmId/revisions', 
  revisionsController.getRevisions
);

router.get(
  '/projects/:projectId/atms/:atmId/revisions/:revisionId',
  revisionsController.getRevisionById
);

router.post(
  '/projects/:projectId/atms/:atmId/revisions',
  revisionsController.createRevision
);

export default router;