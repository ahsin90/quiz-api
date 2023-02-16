import log from "../config/winston.js";
import { make } from "simple-body-validator";
import * as dotenv from "dotenv";
dotenv.config();

import {
  submitAnswers as submitAnswersRepository,
  getResultByUser as getResultByUserRepository,
} from "../repositories/answers.repository.js";

export const submitAnswer = async (req, res) => {
  try {
    // create validation input
    const rules = {
      answers: "required",
      quizUUID: "required",
    };

    const validator = make(req.body, rules);

    if (!validator.validate()) {
      return res.status(400).json({
        code: 400,
        success: false,
        data: null,
        errors: validator.errors().all(false),
      });
    }

    if (!Array.isArray(req.body.answers)) {
      return res.status(400).json({
        code: 400,
        success: false,
        data: null,
        errors: { answers: "The answers must be array." },
      });
    }

    // save
    const save = await submitAnswersRepository(req);

    if (save) {
      await res.status(200).json({
        code: 200,
        success: true,
        data: null,
        errors: null,
      });
    } else {
      throw ["Failed to submit data"];
    }
  } catch (err) {
    log.error(err);
    res.status(417).json({
      code: 417,
      success: false,
      data: null,
      errors: err,
    });
  }
};

export const getResultByUser = async (req, res) => {
  try {
    const results = await getResultByUserRepository(req);

    return res.status(200).json({
      code: 200,
      success: true,
      data: results,
      errors: null,
    });
  } catch (err) {
    log.error(err);
    res.status(417).json({
      code: 417,
      success: false,
      data: null,
      errors: err,
    });
  }
};
