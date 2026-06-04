import { adminDictionariesService } from './admin-dictionaries.service.js';

export const adminDictionariesController = {
  async getDictionary(req, res, next) {
    try {
      const data = await adminDictionariesService.getDictionary({
        type: req.params.type,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createDictionaryItem(req, res, next) {
    try {
      const data = await adminDictionariesService.createDictionaryItem({
        type: req.params.type,
        body: req.body,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateDictionaryItem(req, res, next) {
    try {
      const data = await adminDictionariesService.updateDictionaryItem({
        type: req.params.type,
        id: req.params.id,
        body: req.body,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteDictionaryItem(req, res, next) {
    try {
      const data = await adminDictionariesService.deleteDictionaryItem({
        type: req.params.type,
        id: req.params.id,
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