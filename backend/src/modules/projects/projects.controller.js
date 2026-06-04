import { projectsService } from './projects.service.js';

export const projectsController = {
  async createProject(req, res, next) {
    try {
      const data = await projectsService.createProject({
        userId: req.user.id,
        ...req.body,
      });

      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getMyProjects(req, res, next) {
    try {
      const data = await projectsService.getMyProjects({
        userId: req.user.id,
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getAllProjects(req, res, next) {
    try {
      const data = await projectsService.getAllProjects({
        userId: req.user.id,
        page: req.query.page,
        limit: req.query.limit,
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getTrashProjects(req, res, next) {
    try {
      const data = await projectsService.getTrashProjects({
        userId: req.user.id,
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getProjectById(req, res, next) {
    try {
      const data = await projectsService.getProjectById({
        userId: req.user.id,
        projectId: req.params.projectId,
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async updateProject(req, res, next) {
    try {
      const data = await projectsService.updateProject({
        userId: req.user.id,
        projectId: req.params.projectId,
        ...req.body,
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async moveToTrash(req, res, next) {
    try {
      const data = await projectsService.moveToTrash({
        userId: req.user.id,
        projectId: req.params.projectId,
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async restoreProject(req, res, next) {
    try {
      const data = await projectsService.restoreProject({
        userId: req.user.id,
        projectId: req.params.projectId,
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async copyProject(req, res, next) {
    try {
      const data = await projectsService.copyProject({
        userId: req.user.id,
        projectId: req.params.projectId,
      });

      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};