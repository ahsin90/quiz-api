import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Quiz from "./quiz.model.js";

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const Questions = db.define(
  "questions",
  {
    // Define attributes
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isMandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Questions.belongsTo(Quiz);

// Export model
export default Questions;
