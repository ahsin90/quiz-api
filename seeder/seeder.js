import * as dotenv from "dotenv";
import db from "../config/database.js";
import Users from "../models/users.model.js";
import bcrypt from "bcrypt";

if (process.env.NODE_ENV === "development") {
  // call the seeders
  await createUser();
} else {
  console.log("Note: The seeder only can run in developmen mode");
}

//  run: node seeder/user.seeder.js

async function createUser() {
  let user = {
    email: "user1@mail.com",
    name: "John Doe",
    password: "12345678",
  };
  // create an user
  const salt = await bcrypt.genSalt(10);

  // hash the password before store into database
  user.password = await bcrypt.hash(user.password, salt);

  // create user
  let save = await Users.create(user).then(() => {
    console.log("The user has been created");
  });
}
