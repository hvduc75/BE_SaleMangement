import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import initApiRoutes from "./routes/api";
import initOAuthApiRoutes from "./routes/oauthApi";
import connectDB from "./config/connectDB";
import configCors from "./config/cors";
import './cron/cronJobs';
import configLoginWIthGoogle from "./controllers/social/GoogleController";

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
initOAuthApiRoutes(app);

configLoginWIthGoogle();
app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});
