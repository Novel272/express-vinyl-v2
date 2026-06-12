import express from "express";
import { getGenres, getProducts } from "../controller/ProductsController.js";

export const ProductRouter = express.Router();

ProductRouter.get("/genres", getGenres);
ProductRouter.get("/", getProducts);
