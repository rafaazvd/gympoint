import Mail from '../../lib/Mail';

class AnsweredMail {
  get key() {
    return 'AnsweredMail';
  }

  async handle({ data }) {
    const { helpOrders } = data;
    await Mail.sendMail({
      to: helpOrders.student.email,
      subject: `Pergunta respondida`,
      template: 'questionAnswered',
      context: {
        student: helpOrders.student.name,
        question: helpOrders.question,
        answer: helpOrders.answer,
      },
    });
  }
}

export default new AnsweredMail();
