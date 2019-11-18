import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const students = await Students.findAll({
      where: { id: { allowNull: false } },
      order: ['name'],
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'fill in all fields according to your definition' });
    }

    const studentExists = await Students.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res
        .status(400)
        .json({ erro: 'user already exists or email already registered' });
    }

    const { name, email, age, weight, height } = await Students.create(
      req.body
    );
    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'fill in all fields according to your definition' });
    }
    const { email } = req.body;
    const students = await Students.findByPk(req.id);
    if (email !== students.email) {
      const studentsExists = await Students.findOne({ where: { email } });
      if (studentsExists) {
        return res.status(400).json({ erro: 'email already exists' });
      }
    }

    const { name, age, weight, height } = await students.update(req.body);
    const { id } = req.body;
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async delete(req, res) {
    const students = Students.findOne({
      where: { email: req.body.email },
    });
    if (!students) {
      res.status(400).json({ error: 'student not exists in database' });
    }
    students.destroy({ email: req.body.email });
  }
}

export default new StudentsController();
