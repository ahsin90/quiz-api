import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Quiz from "./quiz.model.js";
import Questions from "./questions.model.js";
import AnswerOpt from "./answersOpt.model.js";
import Users from "./users.model.js";

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const UserAnswers = db.define(
  "userAnswers",
  {},
  {
    freezeTableName: true,
  }
);

UserAnswers.belongsTo(Quiz);
UserAnswers.belongsTo(Questions);
UserAnswers.belongsTo(AnswerOpt);
UserAnswers.belongsTo(Users);

// Export model
export default UserAnswers;
