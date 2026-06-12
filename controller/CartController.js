import pkg from "sqlite3";
import { getDBConnection } from "../db/db.js";

const { OPEN_READWRITE } = pkg;
export async function AddToCart(req, res) {
  let ProductId = parseInt(req.body.productId, 10);
  const db = await getDBConnection();

  if (isNaN(ProductId)) {
    await db.close();
    return res.status(400).json({ error: "Invalid product ID" });
  }
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Please log in first" });
  }

  const existingCartItem = await db.get(
    `SELECT * FROM cart_items WHERE user_id=? AND product_id=?`,
    [userId, ProductId],
  );

  if (existingCartItem) {
    await db.run(`UPDATE cart_items SET quantity = quantity + 1 WHERE id=?`, [
      existingCartItem.id,
    ]);
  } else {
    await db.run(
      `INSERT INTO cart_items (user_id,product_id,quantity) VALUES (?,?,1)`,
      [userId, ProductId],
    );
  }
  res.status(200).json({ message: "Added to cart" });
}

export async function GetCartCount(req, res) {
  const userId = req.session.userId;
  const db = await getDBConnection();
  if (!userId) {
    return res.status(401).json({ error: "Please log in first" });
  }
  const CartCount = await db.get(
    `SELECT SUM(quantity) AS totalItems FROM cart_items WHERE user_id=?`,
    [userId],
  );
  res.json({ totalItems: CartCount.totalItems || 0 });
}

export async function GetAll(req, res) {
  const db = await getDBConnection();
  try {
    const items = await db.all(
      `SELECT ci.id AS cartItemId, ci.quantity, p.title, p.artist, p.price FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = ?`,
      [req.session.userId],
    );
    res.json({ items: items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    if (db) await db.close();
  }
}

export async function deleteItem(req, res) {
  const db = await getDBConnection();
  const UserId = req.session.userId;
  const itemId = parseInt(req.params.itemId, 10);
  if (isNaN(itemId) || !UserId) {
    await db.close();
    return res
      .status(400)
      .json({ error: "Invalid item ID or user not logged in" });
  }
  try {
    const item = await db.get(
      "SELECT quantity FROM cart_items WHERE id = ? AND user_id = ?",
      [itemId, req.session.userId],
    );

    if (!item) {
      return res.status(400).json({ error: "Item not found" });
    }
    const result = await db.run(
      `DELETE FROM cart_items WHERE id=? AND user_id=?`,
      [itemId, UserId],
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    if (db) await db.close();
  }
}

export async function deleteAll(req, res) {
  const db = await getDBConnection();
  const UserId = req.session.userId;
  try {
    if (!UserId) {
      return res.status(401).json({ error: "Please log in first" });
    }
    await db.run(`DELETE FROM cart_items WHERE user_id=?`, [UserId]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    if (db) await db.close();
  }
}
