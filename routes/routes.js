import express from "express";
import {
  createQuiz,
  getQuizByUUID,
  quizList,
  updateQuiz,
} from "../controllers/quiz.js";

import { submitAnswer, getResultByUser } from "../controllers/answer.js";

// Init express routers
const router = express.Router();

router.post("/api/quiz", createQuiz);
router.get("/api/quiz/:uuid", getQuizByUUID);
router.get("/api/quiz", quizList);
router.put("/api/quiz/:uuid", updateQuiz);

router.post("/api/answers", submitAnswer);
router.get("/api/results/:userUUID/:quizUUID", getResultByUser);

export default router;
