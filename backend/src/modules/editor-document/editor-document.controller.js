import { editorDocumentService } from './editor-document.service.js';

export const editorDocumentController = {
  async getEditorDocument(req, res, next) {
    try {
      const data = await editorDocumentService.getEditorDocument({
        userId: req.user.id,
        projectId: req.params.projectId,
        atmId: req.params.atmId,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateEditorDocument(req, res, next) {
    try {
      const data = await editorDocumentService.updateEditorDocument({
        userId: req.user.id,
        projectId: req.params.projectId,
        atmId: req.params.atmId,
        snapshotPatch: req.body,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};