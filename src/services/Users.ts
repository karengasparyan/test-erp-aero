import { LoginHistories, Users } from '../models';
import HttpError from 'http-errors';
import { GetAllData, SortField, SortOrder, Status } from '../types/Global';
import { ChangePasswordType, UpdateInfoType } from '../schemas/users.schema';
import { deleteFile } from '../options/fileSystems';
import { redisClient } from '../options/Redis';
import { getPagination, hashedPassword } from '../utils/helps';
import { FiltersType } from '../schemas/global.schema';
import { Order } from 'sequelize';

export const getById = async (id: string): Promise<Users> => {
  const data: Users | null = await Users.findOne({
    where: { id }
  });

  if (!data) throw HttpError(Status.NOT_FOUND, 'User is not found');

  return data;
};

export const updateInfo = async (user_id: string, payload: UpdateInfoType): Promise<Users> => {
  const { name } = payload;

  const user = await getById(user_id);

  await user.update({ name });

  return user;
};

export const destroy = async (user_id: string): Promise<void> => {
  const user = await getById(user_id);

  await deleteFile(user_id);

  const histories = await LoginHistories.findAll({ where: { user_id } });

  for (const { device } of histories) {
    await redisClient.del(`users:${user_id}:${device}:accessToken`);

    await redisClient.del(`users:${user_id}:${device}:refreshToken`);
  }

  await redisClient.del(`users:${user_id}:verificationToken`);

  return user.destroy();
};

export const changePassword = async (id: string, { password, oldPassword }: ChangePasswordType): Promise<boolean> => {
  const user = await Users.findOne({
    where: {
      id,
      password: hashedPassword(oldPassword)
    }
  });

  if (!user) {
    throw HttpError(Status.BAD_REQUEST, 'Change password is fail');
  }

  await user.update({ password });

  return true;
};

export const loginHistories = async (user_id: string, { page, size, sortOrder, sortField }: FiltersType) => {
  const order: Order = [[sortField || SortField.CREATED_AT, sortOrder || SortOrder.ASC]];

  const { limit, offset } = getPagination(page, size);

  const data: GetAllData<LoginHistories> = await LoginHistories.findAndCountAll({
    distinct: true,
    where: { user_id },
    order,
    limit,
    offset
  });

  return { data: data.rows, count: data.count };
};
