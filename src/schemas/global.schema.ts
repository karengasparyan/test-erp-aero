import { coerce, nativeEnum, number, object, optional, string, TypeOf, z } from 'zod';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, PAGE_LIMIT, SIZE_LIMIT } from '../utils/constants';
import { SortField, SortOrder, Status } from '../types/Global';
import HttpError from 'http-errors';

export const ParamsId = {
  params: object({
    id: string().uuid()
  }).strict()
};

export const ParamsIdSchema = object({
  ...ParamsId
});

export const NumBerParamsId = {
  params: object({
    id: coerce.number()
  }).strict()
};

export const Filters = {
  page: coerce.number().min(1).max(100).default(PAGE_LIMIT),
  size: coerce.number().min(1).max(100).default(SIZE_LIMIT),
  search: string().min(2).optional(),
  sortOrder: optional(nativeEnum(SortOrder).default(SortOrder.DESC)),
  sortField: optional(nativeEnum(SortField).default(SortField.UPDATED_AT))
};

export const file = object({
  fieldname: string().optional(),
  originalname: string().optional(),
  encoding: string().optional(),
  mimetype: string().refine((value: string) => {
    if (!ALLOWED_FILE_TYPES.includes(value)) {
      throw HttpError(Status.UNPROCESSABLE_ENTITY, `Invalid file type. Allowed file types are: ${ALLOWED_FILE_TYPES.join(', ')}`);
    }
    return true;
  }),
  buffer: z.instanceof(Buffer),
  size: number().max(MAX_FILE_SIZE, { message: `File size exceeds the maximum allowed limit ${MAX_FILE_SIZE}` })
});

export const FiltersSchema = object({ query: object(Filters).strict() });

export type ParamsIdType = TypeOf<typeof ParamsIdSchema>['params'];

export type FiltersType = TypeOf<typeof FiltersSchema>['query'];

export type FileType = TypeOf<typeof file>;
