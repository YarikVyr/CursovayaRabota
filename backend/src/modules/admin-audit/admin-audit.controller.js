import { adminAuditService } from './admin-audit.service.js';

export const adminAuditController = {
  async getAuditLogs(req, res, next) {
    try {
      const data = await adminAuditService.getAuditLogs({
        page: req.query.page,
        limit: req.query.limit,
        action: req.query.action,
        entity: req.query.entity,
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