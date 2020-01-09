// require('dotenv/config');
module.exports = {
  database: 'gympoint',
  username: 'root',
  password: '',
  host: 'localhost',
  port: 3308,
  dialect: 'mysql',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
