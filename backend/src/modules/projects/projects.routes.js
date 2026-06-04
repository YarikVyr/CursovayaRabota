import { Router } from 'express';
import { projectsController } from './projects.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', projectsController.createProject);

router.get('/mine', projectsController.getMyProjects);
router.get('/all', projectsController.getAllProjects);
router.get('/trash', projectsController.getTrashProjects);

router.get('/:projectId', projectsController.getProjectById);

router.patch('/:projectId', projectsController.updateProject);
router.patch('/:projectId/trash', projectsController.moveToTrash);
router.patch('/:projectId/restore', projectsController.restoreProject);

router.post('/:projectId/copy', projectsController.copyProject);

export default router;