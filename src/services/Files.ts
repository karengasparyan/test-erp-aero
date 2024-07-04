import HttpError from 'http-errors';
import { GetAllData, SortField, SortOrder, Status } from '../types/Global';
import { FileType, FiltersType } from '../schemas/global.schema';
import { Op, Order } from 'sequelize';
import { getPagination } from '../utils/helps';
import { v4 } from 'uuid';
import { FILE_MIMETYPES } from '../utils/constants';
import Files from '../models/Files';
import { writeFile, deleteFile, readFile } from '../options/fileSystems';
import { Download } from '../types/Files';

export const create = async (user_id: string, file: FileType): Promise<Files> => {
  if (!file) {
    throw HttpError(Status.NOT_FOUND, 'File is required');
  }

  const fileId = v4();

  const url = await writeFile(file, user_id, fileId);

  return Files.create({
    id: fileId,
    user_id,
    url,
    name: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    extension: FILE_MIMETYPES[file.mimetype]
  });
};

export const getById = async (id: string, user_id?: string): Promise<Files> => {
  const data = await Files.findOne({ where: { id, ...(user_id && { user_id }) } });

  if (!data) throw HttpError(Status.NOT_FOUND, 'File is not found');

  return data;
};

export const update = async (user_id: string, id: string, file: FileType): Promise<Files> => {
  if (!file) {
    throw HttpError(Status.NOT_FOUND, 'File is required');
  }

  const data = await getById(id, user_id);

  const url = await writeFile(file, user_id, id);

  if (url !== data.url) {
    await deleteFile(data.url);
  }

  await data.update({
    url,
    name: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    extension: FILE_MIMETYPES[file.mimetype]
  });

  return data;
};

export const destroy = async (user_id: string, id: string) => {
  const data = await getById(id, user_id);

  await data.destroy();

  await deleteFile(data.url);

  return data;
};

export const getAll = async (user_id: string, { search, page, size, sortOrder, sortField }: FiltersType) => {
  const order: Order = [[sortField || SortField.CREATED_AT, sortOrder || SortOrder.ASC]];

  const { limit, offset } = getPagination(page, size);

  if (search) search = `%${search.trim().toLowerCase()}%`;

  const data: GetAllData<Files> = await Files.findAndCountAll({
    distinct: true,
    where: {
      user_id,
      ...(search && {
        [Op.or]: [{ name: { [Op.iLike]: search } }, { mimetype: { [Op.iLike]: search } }, { extension: { [Op.iLike]: search } }]
      })
    },
    order,
    limit,
    offset
  });

  return { data: data.rows, count: data.count };
};

export const download = async (id: string): Promise<Download> => {
  const data = await getById(id);

  const file = await readFile(data.url);

  return { file, ...data.dataValues };
};
