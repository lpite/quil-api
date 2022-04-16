import { model, Schema } from "mongoose";

export interface Question {
  id: number;
  questionText: string;
  answers: Array<Answer>;
}
export interface Answer {
  text: string;
  isRight?: boolean;
}
const answerSchema = new Schema<Answer>({
  text: {
    type: String,
    required: true,
  },
  isRight: String,
});
const questionSchema = new Schema<Question>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  answers: {
    type: [answerSchema],
    required: true,
  },
});
export const notConfirmedQuestion = model(
  "notConfirmedQuestions",
  questionSchema
);
export const questionModel = model("questions", questionSchema);
