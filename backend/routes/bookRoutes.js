import express from "express";
import { getBooks } from "../controllers/bookController.js";
const router = express.Router();

router.route("/").get(getBooks);

export default router;
