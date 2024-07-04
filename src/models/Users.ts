import { DataTypes, Model } from 'sequelize';
import db from '../options/db';
import { hashedPassword } from '../utils/helps';

export default class Users extends Model {
  public declare id: string;

  public declare name: string;

  public declare email: string;

  public declare password: string;

  public declare verified_at: null | Date;

  public declare readonly created_at: Date;

  public declare readonly updated_at: Date;
}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
      set(val) {
        if (val) this.setDataValue('email', String(val).trim().toLowerCase());
      }
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: false,
      set(val) {
        if (val) this.setDataValue('password', hashedPassword(val as string));
      },
      get() {
        return undefined;
      }
    },
    verified_at: {
      type: 'TIMESTAMP',
      defaultValue: null,
      allowNull: true
    }
  },
  {
    sequelize: db,
    tableName: 'users',
    modelName: 'Users'
  }
);
