import { dictionariesService } from './dictionaries.service.js';

export const dictionariesController = {
  async getAll(req, res, next) {
    try {
      const data = await dictionariesService.getAll();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAircraftTypes(req, res, next) {
    try {
      const data = await dictionariesService.getAircraftTypes();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTrainerTypes(req, res, next) {
    try {
      const data = await dictionariesService.getTrainerTypes();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getRmiTypes(req, res, next) {
    try {
      const data = await dictionariesService.getRmiTypes();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAtmSystems(req, res, next) {
    try {
      const data = await dictionariesService.getAtmSystems({
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

  async getAtmSubsystems(req, res, next) {
    try {
      const data = await dictionariesService.getAtmSubsystems({
        systemId: req.query.systemId,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getContracts(req, res, next) {
    try {
      const data = await dictionariesService.getContracts();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getEquipment(req, res, next) {
    try {
      const data = await dictionariesService.getEquipment();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTolerances(req, res, next) {
    try {
      const data = await dictionariesService.getTolerances();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUnits(req, res, next) {
    try {
      const data = await dictionariesService.getUnits();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAbbreviations(req, res, next) {
    try {
      const data = await dictionariesService.getAbbreviations();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};