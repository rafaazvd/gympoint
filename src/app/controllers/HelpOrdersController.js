import * as Yup from 'yup';

import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';
import Enrollment from '../models/Enrollment';
import Queue from '../../lib/Queue';
import AnsweredMail from '../jobs/AnsweredMail';

class HelpOrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
      const { studentId } = req.params;
      const enrollment = Enrollment.findOne({
        where:{student_id: studentId}
      });
      if (!enrollment){
        return res.status(400).json({ error: 'Only registered users may request assistance' });
      }
      const {question} = req.body;
      const {id} = HelpOrders.create({
        student_id: studentId,
        question,
      })
      return res.json({id, studentId, question});
    }
  async index(req, res) {
    const {studentId} = req.params;
    const {page = 1} = req.query;
    const assistanceExists = HelpOrders.findAll({
      where: {student_id: studentId}
    });
    if (!assistanceExists){
      return res.status(400).json({error:'aid messages not recorded by this student!'})
    }
    const helpOrders = HelpOrders.findAll({
      where:{student_id: studentId},
      order: ['created_at'],
      attributes: ['id', 'question', 'answer', 'answer_at'],
      limit: 10,
      offset: (page - 1) * 10,
    });
    return res.json(helpOrders);
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { helpOrderId } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(helpOrderId, {
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    await helpOrders.update({
      answer,
      answer_at: new Date(),
    });
    await Queue.add(AnsweredMail.key, { helpOrders });
    return res.json(helpOrders);
  }
}

export default new HelpOrdersController();
