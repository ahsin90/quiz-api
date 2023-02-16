import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Questions from "./questions.model.js";

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const AnswerOpt = db.define(
  "answersOpt",
  {
    // Define attributes
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRight: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

AnswerOpt.belongsTo(Questions);

// Export model
export default AnswerOpt;
