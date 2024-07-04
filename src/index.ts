import dotenv from 'dotenv';
import express, { Express } from 'express';
import YAML from 'yamljs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { json } from 'body-parser';
import morgan from 'morgan';
import indexRouter from './routes/index';
import { errorHandler, errorNotFound, genericErrorHandler, serverIsRun } from './utils/errorHandlers';
import { NodeEnv } from './types/Global';
import { HOST, NODE_ENV, PORT } from './config';
import { corsOptions } from './utils/helps';

dotenv.config();

process.env.TZ = 'UTC';

const app: Express = express();

const swaggerDocument = YAML.load(path.resolve('./src/docs/swagger.yaml'));

app.use(cors(NODE_ENV === NodeEnv.DEVELOPMENT ? { origin: '*' } : corsOptions));

app.use(json());

app.use(express.urlencoded({ extended: false }));

NODE_ENV !== NodeEnv.PRODUCTION && app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

NODE_ENV !== NodeEnv.PRODUCTION && app.use(morgan('dev'));

app.use('/api', indexRouter);

app.use(express.static(path.resolve('./public')));

app.use(serverIsRun);

app.use(errorNotFound);

app.use(errorHandler);

app.use(genericErrorHandler);

app.listen(PORT, async () => {
  console.info(`Welcome to Test task`);

  console.info(`Api url ${HOST}:${PORT}/api`);

  console.info(`Swagger ${HOST}:${PORT}/docs`);
});
