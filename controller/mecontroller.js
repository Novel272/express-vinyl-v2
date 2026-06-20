import mongoose from "mongoose";
import User from "../models/usersc.js";

export async function getCurrentUser(req, res) {
  try {
    if (!req.session.userId) {
      return res.json({ isLoggedIn: false });
    }
    if (req.session.userId) {
      // const loog = `SELECT name from users where id=?`;
      const user = await User.findById(req.session.userId);
      res.json({ isLoggedIn: true, name: user.name });
    }
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
