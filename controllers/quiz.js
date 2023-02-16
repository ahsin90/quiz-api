import log from "../config/winston.js";
import { make } from "simple-body-validator";
import * as dotenv from "dotenv";
dotenv.config();

import { createQuiz as createQuizRepository } from "../repositories/quiz.repository.js";

export const createQuiz = async (req, res) => {
  try {
    let { email, password } = req.body;

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
      await res.status(200).json({
        code: 200,
        success: true,
        data: save,
        errors: null,
      });
    } else {
      throw "Failed to save data";
    }
  } catch (err) {
    log.error(err);
    res.status(417).json({
      status: false,
      message: "Something went wrong!",
    });
  }
};
