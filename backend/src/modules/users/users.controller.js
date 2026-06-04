import { usersService } from './users.service.js';

export const usersController = {
  async searchUserForShare(req, res, next) {
    try {
      const data = await usersService.searchUserForShare({
        login: req.query.login,
        fullName: req.query.fullName,
        currentUserId: req.user.id,
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