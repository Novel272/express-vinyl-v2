import mongoose from "mongoose";
import Vinyl from "../models/vinylSC.js";

export async function getGenres(req, res) {
  try {
    // Query all unique genres from the products table
    const genreRows = await Vinyl.distinct("genre");
    res.json(genreRows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch genres", details: err.message });
  }
}

export async function getProducts(req, res) {
  try {
    let { genre, search } = req.query;
    let query = {};

    if (genre) {
      query.genre = genre;
    }
    if (search) {
      const sea = new RegExp(search, "i");
      query.$or = [{ title: sea }, { artist: sea }, { genre: sea }];
    }

    //const products = await db.all(productsQuery, params);
    const products = await Vinyl.find(query);
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: err.message });
  }
}
