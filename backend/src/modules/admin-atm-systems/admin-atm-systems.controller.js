import { adminAtmSystemsService } from './admin-atm-systems.service.js';

export const adminAtmSystemsController = {
  async getSystems(req, res, next) {
    try {
      const data = await adminAtmSystemsService.getSystems({
        codeType: req.query.codeType,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createSystem(req, res, next) {
    try {
      const data = await adminAtmSystemsService.createSystem({
        codeType: req.body.codeType,
        code: req.body.code,
        name: req.body.name,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSystem(req, res, next) {
    try {
      const data = await adminAtmSystemsService.updateSystem({
        systemId: req.params.systemId,
        codeType: req.body.codeType,
        code: req.body.code,
        name: req.body.name,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSystem(req, res, next) {
    try {
      const data = await adminAtmSystemsService.deleteSystem({
        systemId: req.params.systemId,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createSubsystem(req, res, next) {
    try {
      const data = await adminAtmSystemsService.createSubsystem({
        systemId: req.params.systemId,
        name: req.body.name,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSubsystem(req, res, next) {
    try {
      const data = await adminAtmSystemsService.updateSubsystem({
        subsystemId: req.params.subsystemId,
        name: req.body.name,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSubsystem(req, res, next) {
    try {
      const data = await adminAtmSystemsService.deleteSubsystem({
        subsystemId: req.params.subsystemId,
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