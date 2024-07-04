import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../options/db';

export default class LoginHistories extends Model {
  public declare id: string;

  public declare user_id: string;

  public declare device: string;

  public declare ip?: string;

  public declare last_login: Date;

  public declare readonly created_at: Date;

  public declare readonly updated_at: Date;
}

LoginHistories.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    device: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    last_login: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: 'login_histories',
    modelName: 'LoginHistories'
  }
);
