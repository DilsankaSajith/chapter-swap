import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import chatUserRoutes from "./routes/chatUserRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
dotenv.config();
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 8000;

connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

// Chat app
app.use("/api/chats/users", chatUserRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
