const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'admin',
      [
        {
          id: 7,
          name: 'Administrador',
          email: 'admin@gympoint.com',
          password_hash: bcrypt.hashSync('654321', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
