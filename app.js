import * as dotenv from "dotenv";
import router from "./routes/routes.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/database.js";

// load environtment variables
dotenv.config();

const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 3000;

if (process.env.ALLOWED_ORIGINS) {
  const whitelist = process.env.ALLOWED_ORIGINS.split(",");
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else if (origin == null && process.env.NODE_ENV == "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORSI"));
      }
    },
  };
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// use app routers
app.use(router);

Promise.all([testDB()])
  .then((x) => {
    startServer();
  })
  .catch((x) => {
    console.log("[APP] Could not start server because of error in DB / S3.");
  });

function startServer() {
  app.listen(port, () => {
    console.log(`[APP] Listening on port ${port}`);
  });
}

function testDB() {
  return new Promise(async (resolve, reject) => {
    try {
      await db.authenticate();
      console.log("[DB] Connection has been established successfully.");
      resolve(true);
    } catch (error) {
      console.error("[DB] Unable to connect to the database:", error);
      reject(error);
    }
  });
}
