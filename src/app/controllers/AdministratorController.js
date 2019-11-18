import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Admin from '../models/Administrator';
import authConfig from '../../config/auth';

class AdministratorController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'user admin not found' });
    }

    if (!(await admin.checkPassword(password))) {
      return res.status(401).json({ error: 'password does not match' });
    }
    const { id, name } = admin;
    return res.json({
      Admin: {
        id,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new AdministratorController();
