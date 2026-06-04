import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { editorDocumentController } from './editor-document.controller.js';

const router = Router();

router.use(authMiddleware);

router.get(
  '/projects/:projectId/atms/:atmId/editor',
  editorDocumentController.getEditorDocument
);

router.patch(
  '/projects/:projectId/atms/:atmId/editor',
  editorDocumentController.updateEditorDocument
);

export default router;