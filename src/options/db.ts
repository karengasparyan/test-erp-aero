import { Dialect, Sequelize } from 'sequelize';
import { DB_DRIVER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../config';

const db = new Sequelize(DB_NAME as string, DB_USER as string, DB_PASSWORD as string, {
  host: DB_HOST as string,
  dialect: DB_DRIVER as Dialect,
  port: parseInt(DB_PORT || '5432'),
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  logging: false
});

export default db;
