import validator from "validator";
import { getDBConnection } from "../db/db.js";
import bcrypt from "bcryptjs";

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
    const db = await getDBConnection();
    const existingUser = `SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE LOWER(email)=LOWER(?)
    OR LOWER(username)=LOWER(?)
    )AS userExists;
    `;

    const { userExists } = await db.get(existingUser, [email, username]);
    if (userExists) {
      return res
        .status(409)
        .json({ error: "Email or username already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10); //used to hash the password before storing the it also the 10 is the cost factor and we use bcrypt.comapre with the original password to log in

    const insert = await db.run(
      `INSERT INTO users (name,email,username,password) VALUES (?,?,?,?)`,
      [name, email, username, hashedPassword],
    );
    req.session.userId = insert.lastID;

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
  const db = await getDBConnection();
  const LogUser = await db.get(
    `SELECT * FROM users WHERE LOWER(username)=LOWER(?)`,
    [username],
  );
  if (!LogUser) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, LogUser.password);
  if (isPasswordValid === false) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (isPasswordValid === true) {
    req.session.userId = LogUser.id;
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
