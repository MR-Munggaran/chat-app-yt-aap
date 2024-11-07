import express from "express";
import {
  loginUser,
  logoutYser,
  signupUser,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/logout", logoutYser);

export default router;
