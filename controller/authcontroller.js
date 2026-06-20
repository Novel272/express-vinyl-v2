import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/usersc.js";
import mongoose from "mongoose";

export async function AuthController(req, res) {
  let regex = /^[a-zA-Z0-9_-]{1,20}$/;
  let { name, email, username, password } = req.body;
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  name = name.trim();
  email = email.trim();
  username = username.trim();
  password = password.trim();
  let check = regex.test(username);
  if (!check) {
    return res.status(400).json({
      error:
        "Username must be 1-20 characters and can only contain letters, numbers, underscores, or hyphens.",
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).catch((err) => {
      console.error("Database error:", err.message);
      throw new Error("Database query failed");
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email or username already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });
    req.session.userId = user._id;

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

export async function loginUser(req, res) {
  let { username, password } = req.body;

  username = username.trim();
  password = password.trim();
  const LogUser = await User.findOne({ username: username });
  if (!LogUser) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, LogUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  } else {
    req.session.userId = LogUser._id;
    res.json({ message: "Logged in" });
  }
}

export async function LogOutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Logout failed. Please try again." });
    }
    return res.status(200).json({ message: "logged out" });
  });
}
