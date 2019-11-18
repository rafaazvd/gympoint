import Sequelize from 'sequelize';

import Admin from '../app/models/Administrator';
import Students from '../app/models/Students';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import Test from '../app/models/Test';
import Checkins from '../app/models/Checkins';

import databaseConfig from '../config/database';

const models = [Test, Plan, Students, Admin, Enrollment, Checkins];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
