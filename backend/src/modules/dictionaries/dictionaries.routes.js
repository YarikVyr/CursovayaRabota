import { Router } from 'express';
import { dictionariesController } from './dictionaries.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', dictionariesController.getAll);

router.get('/aircraft-types', dictionariesController.getAircraftTypes);
router.get('/trainer-types', dictionariesController.getTrainerTypes);
router.get('/rmi-types', dictionariesController.getRmiTypes);

router.get('/atm-systems', dictionariesController.getAtmSystems);
router.get('/atm-subsystems', dictionariesController.getAtmSubsystems);

router.get('/contracts', dictionariesController.getContracts);
router.get('/equipment', dictionariesController.getEquipment);
router.get('/tolerances', dictionariesController.getTolerances);
router.get('/units', dictionariesController.getUnits);
router.get('/abbreviations', dictionariesController.getAbbreviations);

export default router;