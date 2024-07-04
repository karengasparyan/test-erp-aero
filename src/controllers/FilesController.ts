import { Request, Response, NextFunction } from 'express';
import { Status, Success } from '../types/Global';
import * as files from '../services/Files';
import { FileType, FiltersType, ParamsIdType } from '../schemas/global.schema';

export default class FilesController {
  static Create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user } = req;

      const payload = req.file as FileType;

      const data = await files.create(user.id, payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'File upload successfully',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static Update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      const { id } = req.params as ParamsIdType;

      const payload = req.file as FileType;

      const data = await files.update(user_id, id, payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'File upload successfully',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static GetById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      const { id } = req.params as ParamsIdType;

      const data = await files.getById(id, user_id);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'File',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static Destroy = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      const { id } = req.params as ParamsIdType;

      await files.destroy(user_id, id);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Destroy file successfully'
      });
    } catch (e) {
      return next(e);
    }
  };

  static GetAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      const payload = req.query as unknown as FiltersType;

      const data = await files.getAll(user_id, payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Files list',
        ...data
      });
    } catch (e) {
      return next(e);
    }
  };

  static Download = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params as ParamsIdType;

      const { name, file, mimetype, extension } = await files.download(id);

      res.setHeader('Content-Type', mimetype);

      res.setHeader('Content-Disposition', `attachment; filename="${name}.${extension}"`);

      return res.send(file);
    } catch (e) {
      return next(e);
    }
  };
}
