import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SendMail {
  get key() {
    return 'sendMail';
  }

  async handle({ data }) {
    const {
      studentName,
      studentEmail,
      start_date,
      end_date,
      planTitle,
      price,
    } = data;

    console.log(data);

    await Mail.sendMail({
      to: studentEmail,
      subject: `welcomeStudent`,
      template: 'Bem Vindo!',
      context: {
        Aluno: studentName,
        Titulo: planTitle,
        Inicio: format(parseISO(start_date), "'Dia' dd 'de' MMMM' de 'yyyy", {
          locale: pt,
        }),
        Termino: format(parseISO(end_date), "'Dia' dd 'de' MMMM' de 'yyyy", {
          locale: pt,
        }),
        preco: price.toFixed(2),
      },
    });
  }
}

export default new SendMail();
