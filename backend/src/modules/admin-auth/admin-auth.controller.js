import { adminAuthService } from './admin-auth.service.js';

export const adminAuthController = {
  async login(req, res, next) {
    try {
      const result = await adminAuthService.login(req.body);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};