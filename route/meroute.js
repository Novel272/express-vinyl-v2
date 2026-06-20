import express from "express";
import { getCurrentUser } from "../controller/mecontroller.js";

export const meRouter = express.Router();

meRouter.get("/", getCurrentUser);
