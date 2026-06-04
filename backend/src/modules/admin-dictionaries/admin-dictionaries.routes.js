import { Router } from 'express';
import { adminAuthMiddleware } from '../../shared/middlewares/admin-auth.middleware.js';
import { adminDictionariesController } from './admin-dictionaries.controller.js';

const router = Router();

router.use(adminAuthMiddleware);

router.get('/dictionaries/:type', adminDictionariesController.getDictionary);
router.post('/dictionaries/:type', adminDictionariesController.createDictionaryItem);
router.patch('/dictionaries/:type/:id', adminDictionariesController.updateDictionaryItem);
router.delete('/dictionaries/:type/:id', adminDictionariesController.deleteDictionaryItem);

export default router;