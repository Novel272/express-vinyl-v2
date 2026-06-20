import express from "express";
import { getGenres, getProducts } from "../controller/productscontroller.js";

export const ProductRouter = express.Router();

ProductRouter.get("/genres", getGenres);
ProductRouter.get("/", getProducts);
