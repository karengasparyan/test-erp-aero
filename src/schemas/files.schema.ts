import { object } from 'zod';
import { file, ParamsId } from './global.schema';

export const FileCreateSchema = object({
  file
});

export const FileUpdateSchema = object({
  ...ParamsId,
  file
});
