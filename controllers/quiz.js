import log from "../config/winston.js";
import { make } from "simple-body-validator";
import * as dotenv from "dotenv";
dotenv.config();

import {
  createQuiz as createQuizRepository,
  getQuizByUUID as getQuizByUUIDRepository,
  quizList as quizListRepository,
  updateQuiz as updateQuizRepository,
} from "../repositories/quiz.repository.js";
import Quiz from "../models/quiz.model.js";

export const createQuiz = async (req, res) => {
  try {
    // create validation input
    const rules = {
      name: "required",
      questions: "required",
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

    if (!Array.isArray(req.body.questions)) {
      return res.status(400).json({
        code: 400,
        success: false,
        data: null,
        errors: { questions: "The questions must be array." },
      });
    }

    // save
    const save = await createQuizRepository(req);

    if (save) {
      const data = await getQuizByUUIDRepository(save.uuid);

      await res.status(200).json({
        code: 200,
        success: true,
        data: data,
        errors: null,
      });
    } else {
      throw ["Failed to save data"];
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

export const getQuizByUUID = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const result = await getQuizByUUIDRepository(uuid);

    if (result) {
      await res.status(200).json({
        code: 200,
        success: true,
        data: result,
        errors: null,
      });
    } else {
      throw ["No record found"];
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

export const quizList = async (req, res) => {
  try {
    const response = await quizListRepository(req);
    if (res) {
      return res.json({
        code: 200,
        success: true,
        data: response,
        errors: null,
      });
    } else {
      throw "Errors";
    }
  } catch (err) {
    log.error(err);
    return res
      .status(417)
      .json({ code: 417, success: false, data: null, errors: err });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    // create validation input
    const rules = {
      name: "required",
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

    // update
    const update = await updateQuizRepository(req);

    if (update) {
      const data = await getQuizByUUIDRepository(req.params.uuid);

      await res.status(200).json({
        code: 200,
        success: true,
        data: data,
        errors: null,
      });
    } else {
      throw ["Failed to update data"];
    }
  } catch (err) {
    log.error(err);
    return await res
      .status(400)
      .json({ code: 417, success: false, data: null, errors: err });
  }
};
