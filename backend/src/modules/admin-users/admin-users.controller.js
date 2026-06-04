import { adminUsersService } from './admin-users.service.js';

export const adminUsersController = {
  async getUsers(req, res, next) {
    try {
      const data = await adminUsersService.getUsers({
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

  async getUserById(req, res, next) {
    try {
      const data = await adminUsersService.getUserById({
        userId: req.params.userId,
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