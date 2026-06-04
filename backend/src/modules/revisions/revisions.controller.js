import { revisionsService } from './revisions.service.js';

export const revisionsController = {
  async getRevisions(req, res, next) {
    try {
      const data = await revisionsService.getRevisions({
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

  async getRevisionById(req, res, next) {
    try {
      const data = await revisionsService.getRevisionById({
        userId: req.user.id,
        projectId: req.params.projectId,
        atmId: req.params.atmId,
        revisionId: req.params.revisionId,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createRevision(req, res, next) {
    try {
      const data = await revisionsService.createRevision({
        userId: req.user.id,
        projectId: req.params.projectId,
        atmId: req.params.atmId,
        description: req.body.description,
        reason: req.body.reason,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};