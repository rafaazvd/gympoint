import Students from '../models/Students';

class SearchController {
  async index(req, res) {
    const students = await Students.findAll({
      where: { email: req.body.email },
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
    });
    if (!students) {
      res.status(400).json({ error: 'Email not found or student not exists' });
    }
    return res.json(students);
  }
}
export default new SearchController();
