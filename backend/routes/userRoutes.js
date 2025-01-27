import express from "express";
import {
  authUser,
  logout,
  registerUser,
} from "../controllers/userController.js";
const router = express.Router();

router.route("/").post(registerUser);
router.route("/auth").post(authUser);
router.route("/logout").post(logout);

export default router;
