import express from "express";
import { getBooks, createBook } from "../controllers/bookController.js";
const router = express.Router();

router.route("/").get(getBooks).post(createBook);

export default router;
