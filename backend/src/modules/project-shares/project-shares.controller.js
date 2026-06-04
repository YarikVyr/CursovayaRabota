import { projectSharesService } from './project-shares.service.js';

export const projectSharesController = {
  async shareProject(req, res, next) {
    try {
      const data = await projectSharesService.shareProject({
        userId: req.user.id,
        projectId: req.params.projectId,
        login: req.body.login,
        fullName: req.body.fullName,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProjectShares(req, res, next) {
    try {
      const data = await projectSharesService.getProjectShares({
        userId: req.user.id,
        projectId: req.params.projectId,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async revokeProjectShare(req, res, next) {
    try {
      const data = await projectSharesService.revokeProjectShare({
        userId: req.user.id,
        projectId: req.params.projectId,
        shareId: req.params.shareId,
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