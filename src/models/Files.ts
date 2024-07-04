import { DataTypes, Model } from 'sequelize';
import db from '../options/db';
import { Users } from './index';

export default class Files extends Model {
  public declare id: string;

  public declare user_id: string;

  public declare name: string;

  public declare mimetype: string;

  public declare extension: string;

  public declare size: string;

  public declare url: string;

  public declare readonly created_at: Date;

  public declare readonly updated_at: Date;
}

Files.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mimetype: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    extension: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: 'files',
    modelName: 'Files'
  }
);

Users.hasMany(Files, {
  foreignKey: 'user_id',
  as: 'files',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

Files.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});
