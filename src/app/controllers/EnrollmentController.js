import * as Yup from 'yup';
import { format, addMonths, parseISO, isBefore } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Students from '../models/Students';

import Queue from '../../lib/Queue';
import SendMail from '../jobs/SendMail';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails!' });
    }
    const oldDate = req.body.start_date;
    const parsedDate = parseISO(oldDate);

    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'You cannot enroll in past date' });
    }
    const alreadyEnrollment = await Enrollment.findOne({
      where: {
        student_id: req.body.student_id,
      },
    });

    if (alreadyEnrollment) {
      return res
        .status(400)
        .json({ error: 'This student is already enrollment' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    const student = await Students.findByPk(req.body.student_id);
    if (!student) {
      return res.status(404).json({ error: 'student not found' });
    }

    const startDate = req.body.start_date;
    const start_date = format(startDate, 'DD/MM/YYYY', { locale: pt });
    const months = plan.duration;
    const planPrice = plan.price;
    const end_date = addMonths(parseISO(start_date), months);
    const price = planPrice * months;

    const registration = await Enrollment.create({
      ...req.body,
      price,
      end_date,
    });
    const { name: studentName, email: studentEmail } = await Students.findByPk(
      req.body.student_id
    );
    await Queue.add(SendMail.key, {
      studentName,
      studentEmail,
      start_date,
      end_date,
      planTitle: plan.title,
      price,
    });

    return res.json(registration);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const enrollment = await Enrollment.findAll({
      order: ['created_at'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plans',
          attributes: ['id', 'title'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().positive(),
      plan_id: Yup.number().positive(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, start_date, plan_id } = req.body;

    const enrollment = await Enrollment.findOne({ where: { student_id } });

    if (!enrollment) {
      return res.status(400).json({ error: 'the student is not enrolled' });
    }

    if (start_date !== enrollment.start_date) {
      const oldDate = parseISO(start_date);
      if (isBefore(oldDate, new Date())) {
        return res.status(400).json({ error: 'invalid date' });
      }
    }

    if (plan_id !== enrollment.plan_id) {
      const planExists = await Plan.findByPk(plan_id);
      if (!planExists) {
        return res.status(400).json({ error: 'plan does not exist' });
      }
    }

    const plan = await Plan.findByPk(plan_id);
    const { price, duration } = plan;
    const endPrice = duration * price;
    const end_date = addMonths(parseISO(start_date), duration);

    const { id } = await enrollment.update({
      ...req.body,
      price: endPrice,
      end_date,
    });

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const { enrollmentId } = req.params;
    const enrollment = await Enrollment.findByPk(enrollmentId);
    await enrollment.destroy();

    return res.json({ msg: 'enrollment deleted' });
  }
}
export default new EnrollmentController();
