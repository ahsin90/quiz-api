import { Op } from "sequelize";
import db from "../config/database.js";
import log from "../config/winston.js";
import Quiz from "../models/quiz.model.js";
import Questions from "../models/questions.model.js";
import AnswerOpt from "../models/answersOpt.model.js";
import UserAnswers from "../models/userAnswers.model.js";
import { getQuizByUUID } from "./quiz.repository.js";
import { getPagination, getPagingData } from "../helpers/helpers.js";

export const submitAnswers = async (req) => {
  try {
    const { quizUUID, answers } = req.body;
    const userId = 1; // john doe

    // check quiz
    const quiz = await getQuizByUUID(quizUUID);

    if (quiz) {
      const tmpAnswers = [];
      if (answers.length > 0) {
        for (let index in answers) {
          tmpAnswers[index] = {
            userId: userId,
            quizId: quiz.id,
            questionId: answers[index].questionId,
            answersOptId: answers[index].answerId,
          };
        }
      }

      //  save answers
      let saveAnswers = await UserAnswers.bulkCreate(tmpAnswers, {
        returning: true,
      });

      if (saveAnswers) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    log.error(err);
  }
};

export const getResultByUser = async (req) => {
  try {
    const userUUID = req.params.userUUID;
    const quizUUID = req.params.quizUUID;

    const [results] = await db.query(
      "SELECT u.id, u.uuid, u.name as userName, u.email as userEmail, q.name as quizName, qts.id as questionId, qts.title as questionTitle, ao.name as userAnswer, ao.isRight  FROM users u LEFT JOIN  userAnswers ua ON u.id=ua.userId LEFT JOIN answersOpt ao ON ao.id=ua.answersOptId LEFT JOIN questions qts ON qts.id=ua.questionId LEFT JOIN quiz q ON ua.quizId=q.id WHERE u.uuid LIKE '" +
        userUUID +
        "' AND q.uuid LIKE '%" +
        quizUUID +
        "%' "
    );

    return formatResult(results);
  } catch (err) {
    log.error(err);
  }
};

function formatResult(rows) {
  let result = {};
  let questions = [];

  if (rows.length > 0) {
    for (let index in rows) {
      result.id = rows[index].id;
      result.uuid = rows[index].uuid;
      result.userName = rows[index].userName;
      result.userEmail = rows[index].userEmail;
      result.quizName = rows[index].quizName;

      questions[rows[index].questionId] = {
        questionTitle: rows[index].questionTitle,
        userAnswer: rows[index].userAnswer,
        isRight: rows[index].isRight,
      };
    }
  }
  const filtered = questions.filter(function (el) {
    return el != null;
  });

  result.questions = filtered;

  return result;
}
