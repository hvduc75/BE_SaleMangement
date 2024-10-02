import express from "express";
import dotenv from "dotenv"; // Import dotenv theo cú pháp ES6

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});
