const { v4 } = require('uuid');

const user_id = v4();

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('users', [
        {
          id: user_id,
          name: 'Admin',
          email: 'user@example.com',
          //As12#sd45
          password: '21726c0d5e38f08dce41bb6403e7c62ed6935956175d0fdf6c2e2ccbdfd41702',
        }
      ]);

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  down: async (queryInterface) => queryInterface.bulkDelete('users', { email: 'user@example.com' })
};
