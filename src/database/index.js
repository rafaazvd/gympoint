import Sequelize from 'sequelize';

import Admin from '../app/models/Administrator';
import Student from '../app/models/Students';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import Checkin from '../app/models/Checkins';
import HelpOrder from '../app/models/HelpOrders';

import databaseConfig from '../config/database';

const models = [Admin, Student, Plan, Enrollment, Checkin, HelpOrder];

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
