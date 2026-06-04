import express from 'express';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes.js';
import { authMiddleware } from './shared/middlewares/auth.middleware.js';
import { errorMiddleware } from './shared/middlewares/error.middleware.js';
import adminAuthRoutes from './modules/admin-auth/admin-auth.routes.js';
import dictionariesRoutes from './modules/dictionaries/dictionaries.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import projectsRoutes from './modules/projects/projects.routes.js';
import projectSharesRoutes from './modules/project-shares/project-shares.routes.js';
import atmsRoutes from './modules/atms/atms.routes.js';
import revisionsRoutes from './modules/revisions/revisions.routes.js';
import editorDocumentRoutes from './modules/editor-document/editor-document.routes.js';
import adminDictionariesRoutes from './modules/admin-dictionaries/admin-dictionaries.routes.js';
import adminAtmSystemsRoutes from './modules/admin-atm-systems/admin-atm-systems.routes.js';
import adminUsersRoutes from './modules/admin-users/admin-users.routes.js';
import adminAuditRoutes from './modules/admin-audit/admin-audit.routes.js';

const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ATM Constructor API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/dictionaries', dictionariesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api', projectSharesRoutes);
app.use('/api', atmsRoutes);
app.use('/api', revisionsRoutes);
app.use('/api', editorDocumentRoutes);
app.use('/api/admin', adminDictionariesRoutes);
app.use('/api/admin', adminAtmSystemsRoutes);
app.use('/api/admin', adminUsersRoutes);
app.use('/api/admin', adminAuditRoutes);

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

app.use(errorMiddleware);

export default app;