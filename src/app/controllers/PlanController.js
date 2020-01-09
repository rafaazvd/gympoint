import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    if (req.params.id) {
      const plans = await Plan.findByPk(req.params.id, {
        attributes: ['id', 'title', 'duration', 'price'],
      });
      return res.json(plans);
    }

    const plans = await Plan.findAll({
      order: ['duration'],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'title', 'duration', 'price'],
    });
    if (!plans) {
      res.status(400).json({ error: 'not exists plans' });
    }
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation fails' });
    }
    const titleExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (titleExists) {
      res.status(400).json({ error: 'title already exists' });
    }
    const created_at = new Date();
    const updated_at = new Date();

    const { title, duration, price } = Plan.create(req.body);
    return res.json({
      title,
      duration,
      price,
      created_at,
      updated_at,
    });
  }

  async update(req, res) {
    const { planId } = req.params;
    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }
    const schema = Yup.object().shape({
      title: Yup.string(),
      price: Yup.number(),
      duration: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }
    const { title } = req.body;
    const titleExist = Plan.findOne({
      where: { title },
    });
    if (titleExist) {
      return res.status(400).json({ error: 'title already exists' });
    }
    const updated_at = new Date();
    const { price, duration } = req.body;
    await plan.update({
      title,
      price,
      duration,
      updated_at,
    });
    return res.json({
      title,
      price,
      duration,
    });
  }

  async delete(req, res) {
    const { planId } = req.params;
    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(400).json({ error: 'plan does not exists' });
    }

    const { title } = plan;
    await plan.destroy();

    return res.json({ msg: `Plan ${title} was deleted` });
  }
}

export default new PlanController();
