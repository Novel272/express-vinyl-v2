import express from "express";
import {
  AddToCart,
  GetCartCount,
  GetAll,
  deleteAll,
  deleteItem,
} from "../controller/cartcontroller.js";

import { required } from "../MiddleWare/required.js";

export const CartRouter = express.Router();
CartRouter.post("/add", required, AddToCart);
CartRouter.get("/cart-count", required, GetCartCount);
CartRouter.get("/", required, GetAll);
CartRouter.delete("/all", required, deleteAll);
CartRouter.delete("/:itemId", required, deleteItem);
