import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
  static init(connection) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(10, 2),
      },
      {
        sequelize: connection,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plans' });
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'student',
    });
  }
}

export default Enrollment;
