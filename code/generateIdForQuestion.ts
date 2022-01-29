import { notConfirmedQuestion, question } from "../models/question";

/** 
Генерирует id для нового вопроса в базе данных
@param notConfirmed Если true то сделает id для не проверенных вопросов
*/
export default async function generateIdForQuestion(notConfirmed?: boolean) {
  if (notConfirmed) {
    const questionId = await notConfirmedQuestion
      .findOne()
      .sort({ id: -1 })
      .select({ id: 1 })
      .then((data) => {
        if (data?.id) {
          return data?.id;
        } else {
          return 0;
        }
      })
      .catch(() => {
        return 0;
      });
    return questionId + 1;
  } else {
    const questionId = await question
      .findOne()
      .sort({ id: -1 })
      .select({ id: 1 })
      .then((data) => {
        if (data?.id) {
          return data?.id;
        } else {
          return 0;
        }
      })
      .catch(() => {
        return 0;
      });
    return questionId + 1;
  }
}
