module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'plans',
      [
        {
          title: 'premium',
          duration: 8,
          price: 122,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
