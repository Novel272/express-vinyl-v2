import { getDBConnection } from "../db/db.js";

export async function getGenres(req, res) {
  try {
    const db = await getDBConnection();
    // Query all unique genres from the products table
    const genres = `SELECT DISTINCT genre FROM products`;
    const genreRows = await db.all(genres); // No filter needed
    // Map to array of strings
    const items = genreRows.map((item) => item.genre);
    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch genres", details: err.message });
  }
}

export async function getProducts(req, res) {
  try {
    const db = await getDBConnection();
    let productsQuery = `SELECT * FROM products`;
    let params = []; // Added 'let' to define params

    let { genre, search } = req.query;

    // 1. Build the Filter Logic
    let conditions = [];

    if (genre) {
      productsQuery += " WHERE genre = ?";
      params.push(genre);
    } else if (search) {
      // Search across multiple columns
      productsQuery += ` WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    const products = await db.all(productsQuery, params);
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: err.message });
  }
}
