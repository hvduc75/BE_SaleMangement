import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import initApiRoutes from "./routes/api";
import connectDB from "./config/connectDB";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

// config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// test connection db
connectDB();

// config router
initApiRoutes(app);

app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});
