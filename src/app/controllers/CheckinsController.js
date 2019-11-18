import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkins from '../models/Checkins';
import Students from '../models/Students';

class CheckinsController {
  async store(req, res) {
    const { studentId } = req.params;
    const student = await Students.findOne({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(400).json({ error: 'This user is not registration' });
    }

    const checkins = await Checkins.findAndCountAll({
      where: {
        student_id: studentId,
        created_at: { [Op.between]: [subDays(new Date(), 7), new Date()] },
      },
    });

    /* Checkins.destroy({
      where: {
        student_id: studentId,
        created_at: { [Op.lte]: subDays(new Date(), 8) },
      },
    }); */

    if (checkins >= 5) {
      return res.status(400).json({ error: 'Checkins number exceeded' });
    }

    const checkin = await Checkins.create({ student_id: studentId });
    return res.json(checkin);
  }

  async index(req, res) {
    const { studentId } = req.params;
    const { page = 1 } = req.query;

    const student = await Students.findOne({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(400).json({ error: 'This user is not registration' });
    }

    const checkins = await Checkins.findAll({
      where: { student_id: studentId },
      order: ['created_at'],
      attributes: ['student_id', 'updated_at'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(checkins);
  }
}

export default new CheckinsController();
