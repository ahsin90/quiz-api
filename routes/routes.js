import express from "express";
import { createQuiz } from "../controllers/quiz.js";

// Init express routers
const router = express.Router();

router.post("/api/quiz", createQuiz);

export default router;
