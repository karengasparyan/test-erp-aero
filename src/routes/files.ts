import { Router } from 'express';
import multer from 'multer';
import FilesController from '../controllers/FilesController';
import AuthorizationMiddleware from '../middlewares/authorization.middleware';
import ValidationMiddleware from '../middlewares/validation.middleware';
import { FiltersSchema, ParamsIdSchema } from '../schemas/global.schema';
import { FileCreateSchema, FileUpdateSchema } from '../schemas/files.schema';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.use(AuthorizationMiddleware());

router.get('/', ValidationMiddleware(FiltersSchema), FilesController.GetAll);

router.post('/', upload.single('file'), ValidationMiddleware(FileCreateSchema), FilesController.Create);

router.put('/:id', upload.single('file'), ValidationMiddleware(FileUpdateSchema), FilesController.Update);

router.get('/:id', ValidationMiddleware(ParamsIdSchema), FilesController.GetById);

router.delete('/:id', ValidationMiddleware(ParamsIdSchema), FilesController.Destroy);

router.get('/download/:id', ValidationMiddleware(ParamsIdSchema), FilesController.Download);

export default router;
