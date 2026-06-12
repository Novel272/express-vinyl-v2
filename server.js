import express from "express";
import cors from "cors";
import { ProductRouter } from "./route/products.js";
import { AuthRouter } from "./route/authRouter.js";
import session from "express-session";
import dotenv from "dotenv";
import { CartRouter } from "./route/CartRouter.js";
import { meRouter } from "./route/meRoute.js";

dotenv.config();

const PORT = 3000;

const app = express();
const secret = process.env.SPIRAL_SESSION_SECRET;

app.use(express.json()); // Middleware to parse JSON bodies from incoming requests
// Configure session middleware for Express
app.use(
  session({
    // Secret key used to sign the session ID cookie
    secret: secret,

    // Forces the session to be saved back to the session store, even if it was never modified during the request
    resave: false,

    // Forces a session that is "uninitialized" to be saved to the store
    // Useful for implementing login sessions, but can be set to false to comply with laws that require permission before setting cookies
    saveUninitialized: false,

    // Settings for the session ID cookie
    cookie: {
      // Ensures the cookie is only accessible by the web server (not JavaScript in the browser)
      httpOnly: true,

      // Ensures the cookie is only sent over HTTPS (should be true in production)
      secure: false,

      // Controls when cookies are sent; 'lax' helps protect against CSRF attacks
      sameSite: "lax",
    },
  }),
);

app.use(express.static("public")); // Serve static files from the "public" directory
app.use("/api/products", ProductRouter); // Use the ProductRouter for routes starting with /api/products
app.use("/api/auth/me", meRouter); // Use the meRouter for routes starting with /api/auth/me
app.use("/api/auth", AuthRouter); // Use the AuthRouter for routes starting with /api/auth
app.use("/api/cart", CartRouter); // Use the CartRouter for routes starting with /cart

// Handle undefined routes
app.get((req, res) => {
  res.status(404).json({
    message: "Endpoint not found. Please check the API documentation.",
  });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
