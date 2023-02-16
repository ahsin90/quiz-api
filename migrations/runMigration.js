import * as dotenv from "dotenv";
import db from "../config/database.js";
import Users from "../models/users.model.js";
import Quiz from "../models/quiz.model.js";
import Questions from "../models/questions.model.js";
import AnswerOpt from "../models/answersOpt.model.js";

if (process.env.NODE_ENV === "development") {
  // db.sync()
  db.sync({ force: true });
} else {
  console.log("Note: The migration only can run in development mode");
}

//  run: node migrations/runMigration.js
