import express from "express";
import { createQuiz, getQuizByUUID } from "../controllers/quiz.js";

// Init express routers
const router = express.Router();

router.post("/api/quiz", createQuiz);
router.get("/api/quiz/:uuid", getQuizByUUID);

export default router;
