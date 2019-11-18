import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';

class AnswerController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const helpOrders = await HelpOrders.findAll({
      where: { answer_at: null },
      attributes: ['id', 'question'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    return res.json(helpOrders);
  }
}

export default new AnswerController();
