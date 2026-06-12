import {
  AuthController,
  loginUser,
  LogOutUser,
} from "../controller/authController.js";
import express from "express";

export const AuthRouter = express.Router();

AuthRouter.post("/register", AuthController);
AuthRouter.post("/login", loginUser);
AuthRouter.get("/logout", LogOutUser);
