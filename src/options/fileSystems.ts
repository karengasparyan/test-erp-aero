import path from 'path';
import HttpError from 'http-errors';
import { rimraf } from 'rimraf';
import { Status } from '../types/Global';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import { FILE_MIMETYPES } from '../utils/constants';
import { FileType } from '../schemas/global.schema';
import { HOST } from '../config';

export const writeFile = async (file: FileType, folder: string, filename: string): Promise<string> => {
  try {
    if (!file) return '';

    const direction = path.resolve('public', folder);

    if (!existsSync(direction)) {
      await fs.mkdir(direction, { recursive: true });
    }

    const ext: string = FILE_MIMETYPES[file.mimetype];

    const filePath = path.join(direction, `${filename}.${ext}`);

    await fs.writeFile(filePath, file.buffer);

    return `/${folder}/${filename}.${ext}`;
  } catch (e) {
    console.error(e);
    throw HttpError(Status.BAD_REQUEST, 'File write error');
  }
};

export const readFile = async (filePath: string): Promise<Buffer> => {
  try {
    const direction = path.join('public', filePath.replace(HOST as string, ''));

    return fs.readFile(direction);
  } catch (e) {
    console.error(e);
    throw HttpError(Status.BAD_REQUEST, 'Read file error');
  }
};

export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    if (!filePath) return false;

    const direction = path.join(__dirname, '../../public', filePath);

    return rimraf(direction);
  } catch (e) {
    console.error('deleteFile ->', e);
    return false;
  }
};
