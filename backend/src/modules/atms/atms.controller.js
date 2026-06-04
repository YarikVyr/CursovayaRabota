import { atmsService } from './atms.service.js';

export const atmsController = {
  async createAtm(req, res, next) {
    try {
      const data = await atmsService.createAtm({
        userId: req.user.id,
        projectId: req.params.projectId,
        ...req.body,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProjectAtms(req, res, next) {
    try {
      const data = await atmsService.getProjectAtms({
        userId: req.user.id,
        projectId: req.params.projectId,
        tab: req.query.tab,
        search: req.query.search,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAtmById(req, res, next) {
    try {
      const data = await atmsService.getAtmById({
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

  async updateAtm(req, res, next) {
    try {
      const data = await atmsService.updateAtm({
        userId: req.user.id,
        projectId: req.params.projectId,
        atmId: req.params.atmId,
        ...req.body,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async moveAtmToTrash(req, res, next) {
    try {
      const data = await atmsService.moveAtmToTrash({
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

  async restoreAtm(req, res, next) {
    try {
      const data = await atmsService.restoreAtm({
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

  async eraseAtm(req, res, next) {
    try {
      const data = await atmsService.eraseAtm({
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
};