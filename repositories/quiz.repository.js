import { Op } from "sequelize";
import db from "../config/database.js";
import log from "../config/winston.js";
import Quiz from "../models/quiz.model.js";
import Questions from "../models/questions.model.js";
import AnswerOpt from "../models/answersOpt.model.js";
import { uuid } from "uuidv4";

export const createQuiz = async (req) => {
  try {
    if (req.body.isMandatory === "") {
      req.body.isMandatory = 0;
    }
    const result = await db.transaction(async (t) => {
      // save quiz data
      const saveQuiz = await Quiz.create(req.body, {
        transaction: t,
      });

      if (saveQuiz) {
        // prepare to save questions data
        let questions = [];
        let answers = [];
        if (req.body.questions.length > 0) {
          for (let index in req.body.questions) {
            // assign UUID and quiz ID into questions data
            req.body.questions[index].uuid = uuid();
            req.body.questions[index].quizId = saveQuiz.id;
            questions.push(req.body.questions[index]);

            if (Array.isArray(req.body.questions[index].answers)) {
              for (let answerIndex in req.body.questions[index].answers) {
                // assign question UUID into answer data
                req.body.questions[index].answers[answerIndex].questionUUID =
                  req.body.questions[index].uuid;

                answers.push(req.body.questions[index].answers[answerIndex]);
              }
            }
          }
        }
        // save questions
        let saveQuestions = await Questions.bulkCreate(questions, {
          returning: true,
          transaction: t,
        });

        // prepare to save answer
        if (saveQuestions) {
          let answerData = [];
          if (answers.length > 0) {
            for (let answerIndex2 in answers) {
              // assign questionId into answers data
              answers[answerIndex2].questionId = getQuestionId(
                answers[answerIndex2].questionUUID,
                saveQuestions
              );
              answerData.push(answers[answerIndex2]);
            }

            //   save answers data
            let saveAnswer = await AnswerOpt.bulkCreate(answerData, {
              returning: true,
              transaction: t,
            });
          }
        }
      }

      return saveQuiz;
    });

    if (result) {
      // get record
      const quizData = getQuizByUUID(result.uuid);
      return quizData;
    } else {
      return false;
    }
  } catch (err) {
    log.error(err);
  }
};

function getQuestionId(uuid, questionsData = []) {
  let id = null;
  if (questionsData.length > 0) {
    for (let i in questionsData) {
      if (questionsData[i].uuid === uuid) {
        id = questionsData[i].id;
      }
    }
  }
  return id;
}

export const getQuizByUUID = async (uuid) => {
  try {
    const quiz = await Quiz.findOne({
      where: { uuid: uuid },
      raw: true,
    });

    if (quiz) {
      // query the questions
      const [questions] = await db.query(
        "SELECT q.*, ao.id as answerId, ao.name as answerName, ao.isRight FROM questions q LEFT JOIN answersOpt ao ON q.id=ao.questionId WHERE q.quizId = " +
          quiz.id
      );

      quiz.questions = separateQuestions(questions);
    }

    return quiz;
  } catch (err) {
    log.error(err);
  }
};

function separateQuestions(rows) {
  let questions = [];

  if (rows.length > 0) {
    for (let index in rows) {
      questions[rows[index].id] = {
        id: rows[index].id,
        uuid: rows[index].uuid,
        title: rows[index].title,
        isMandatory: rows[index].isMandatory,
        createdAt: rows[index].createdAt,
        updatedAt: rows[index].updatedAt,
        answers: separateAnswer(rows[index].id, rows),
      };
    }
  }
  // remove null
  const filtered = questions.filter(function (el) {
    return el != null;
  });

  return filtered;
}

function separateAnswer(questionId, rows) {
  let answers = [];

  if (rows.length > 0) {
    for (let index in rows) {
      if (rows[index].id === questionId) {
        answers[index] = {
          id: rows[index].answerId,
          name: rows[index].answerName,
          isRight: rows[index].isRight,
        };
      }
    }
  }

  const filtered = answers.filter(function (el) {
    return el != null;
  });

  return filtered;
}
