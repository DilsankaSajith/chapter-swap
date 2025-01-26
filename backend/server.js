import express from "express";
import dotenv from "dotenv";
import bookRouter from "./routes/bookRoutes.js";
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

app.use("/api/books", bookRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
