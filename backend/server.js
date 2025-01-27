import express from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
import connectDB from "./config/db.js";

const port = process.env.PORT || 8000;

connectDB();

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
