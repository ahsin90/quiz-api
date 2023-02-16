import { Sequelize } from "sequelize";
import db from "../config/database.js";

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const Quiz = db.define(
  "quiz",
  {
    // Define attributes
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isMandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PUBLISH", "DRAFT"),
      defaultValue: "DRAFT",
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// Export model
export default Quiz;
