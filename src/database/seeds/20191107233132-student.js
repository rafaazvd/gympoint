module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Rafael Azevedo',
          email: 'rafa-spdf@hotmail.com',
          age: 25,
          weight: 69.11,
          height: 1.7,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
