import mongoose from "mongoose";
import User from "../models/usersc.js";
import Vinyl from "../models/vinylsc.js";

export async function AddToCart(req, res) {
  let ProductId = req.body.productId;

  if (!mongoose.Types.ObjectId.isValid(ProductId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Please log in first" });
  }

  const existingCartItem = await User.findOne({
    _id: userId,
    "cart.productId": ProductId,
  });

  if (existingCartItem) {
    await User.updateOne(
      {
        _id: userId,
        "cart.productId": ProductId,
      },
      {
        $inc: { "cart.$.quantity": 1 },
      },
    );
  }
  if (!existingCartItem) {
    await User.updateOne(
      {
        _id: userId,
      },
      {
        $push: {
          cart: {
            productId: ProductId,
            quantity: 1,
          },
        },
      },
    );
  }
  res.status(200).json({ message: "Added to cart" });
}

export async function GetCartCount(req, res) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Please log in first" });
  }
  const user = await User.findById(userId);
  const CartCount = user ? user.CartCount : 0;
  res.json({ totalItems: CartCount });
}

export async function GetAll(req, res) {
  const userId = req.session.userId;
  try {
    const user = await User.findById(userId).populate("cart.productId");
    const formattedItems = user.cart
      .filter((item) => item.productId != null) // Safety check in case a vinyl was deleted from the DB
      .map((item) => {
        return {
          cartItemId: item.productId._id,
          title: item.productId.title,
          price: item.productId.price,
          quantity: item.quantity,
        };
      });

    res.json({ items: formattedItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function deleteItem(req, res) {
  const userId = req.session.userId;
  const itemId = req.params.itemId;
  if (!mongoose.Types.ObjectId.isValid(itemId) || !userId) {
    return res
      .status(400)
      .json({ error: "Invalid item ID or user not logged in" });
  }
  try {
    const targetObjectId = new mongoose.Types.ObjectId(itemId);
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { cart: { productId: targetObjectId } } },
    );
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Item not found in cart" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function deleteAll(req, res) {
  const userId = req.session.userId;
  try {
    if (!userId) {
      return res.status(401).json({ error: "Please log in first" });
    }
    await User.updateOne({ _id: userId }, { cart: [] });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
