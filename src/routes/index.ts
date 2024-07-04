import { Router } from 'express';

import auth from './auth';

import user from './users';

import files from './files';

const router = Router();

router.use('/auth', auth);

router.use('/users', user);

router.use('/files', files);

export default router;
