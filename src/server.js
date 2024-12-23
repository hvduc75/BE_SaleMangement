import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import initApiRoutes from "./routes/api";
import connectDB from "./config/connectDB";
import configCors from "./config/cors";
import './cron/cronJobs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

// config cors
configCors(app);

// config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie -parser
app.use(cookieParser());

// test connection db
connectDB();

// config router
initApiRoutes(app);

app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});
