import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

//models
import { notConfirmedQuestion, Question, questionModel } from "./models/question";
import {userModel}  from "./models/user"

//functions
import generateIdForQuestion from "./code/generateIdForQuestion";
import shuffleArray from "./code/shuffleArray";

//dotenv
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get("/", (_, res) => {
  res.send("hello");
});
app.get("/get/question/", async (req, res) => {
  try {
    const questionId = parseInt(req.query.id?.toString() || "0");
    const questionObject = await questionModel
      .findOne({ id:{$gt:questionId-1}})
      .catch((error) => {
        console.log(error)
      });
    if (!questionObject) {
      const questionObject = await questionModel
      .findOne({ id:{$gt:0}})
      .catch((error) => {
        console.log(error)
      });
      return res.send(questionObject)
    } else {
      questionObject.answers = shuffleArray(questionObject.answers);
    }
    res.send(questionObject);
  } catch (error) {
    console.log(error);

    res.send({});
  }
});
app.post("/insert/question/", async (req, res) => {
  try {
    const newQuestion: Question = req.body;
    if (newQuestion.questionText.length && newQuestion.answers.length) {
      notConfirmedQuestion.create({
        id: await generateIdForQuestion(true),
        questionText: newQuestion.questionText,
        answers: newQuestion.answers,
      });
    }
    res.send(newQuestion);
  } catch (error) {
    res.send("error");
  }
});
app.post("/confirm/question/", async (req, res) => {
  try {
    const questionId = parseInt(req.query.id?.toString() || "0");
    const questionForConfirmation = await notConfirmedQuestion.findOne({
      id: questionId,
    });
    if (questionForConfirmation) {
      questionModel
        .create({
          id: await generateIdForQuestion(),
          questionText: questionForConfirmation.questionText,
          answers: questionForConfirmation.answers,
        })
        .then(async () => {
          await notConfirmedQuestion.findOneAndDelete({ id: questionId });
        })
        .catch((e) => {
          console.log(e);
        });
      res.send("ok");
    }
  } catch (error) {
    res.send("error");
  }
});

app.post("/api/check/answer",async(req,res)=>{
  try {
    const questionId = Number(req.body.questionId)
    const answerText = req.body.answerText.toString()

    const question = questionModel.findOne({id:questionId})

  } catch (error) {
    
  }
})

app.post("/api/signup/user",async(req,res)=>{
  try {
    const username = req.body.username.toString()

    await userModel.create({username:username}).catch((error)=>{
      console.log(error)
    })
    
  } catch (error) {
    res.send("error")  
  }
});






app.listen(PORT, () => {
  mongoose.connect(process.env.MONGO_URL || "", {
    autoIndex: true,
    autoCreate: true,
  });
  console.log(`app started on http://localhost:${PORT}`);
});
