# Spiral Sounds – Simple Express Learning Project

This project is a beginner-friendly Express.js application that is a simple product listing site with search and filter functionality. It uses Express for the backend, SQLite for data storage, and vanilla JavaScript for the frontend.

## Features

- **Product Listing**: View a list of products with details such as name, description, price, and image.
- **Search Functionality**: Search for products based on keywords.
- **Filtering**: Filter the product list by genre, price range, and availability.
- **Authentication**: Sign up, log in, and log out using email, username, and password.
- **User Cart**: Add products to the cart and manage cart items.
- **User Orders**: Create and manage orders, including adding items and updating order details.
- **Backend API**: RESTful API for interacting with product and user data.
- **Frontend**: Renders the product list, handles user input for search and filter, and manages user authentication and cart functionality.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure you have a SQLite database file (`database.db`) in the root directory. (You can use the provided `CreateTable.js` to set up the database if needed.)

### Running the Project

Start the server with:

```bash
node server.js
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `server.js` – Main Express server file
- `controller/ProductsController.js` – API logic for products and genres
- `controller/AuthController.js` – API logic for authentication (Sign Up, Login, Logout)
- `controller/CartController.js` – API logic for managing user cart
- `controller/OrderController.js` – API logic for managing user orders
- `route/products.js` – Express router for product endpoints
- `route/auth.js` – Express router for authentication endpoints
- `route/cart.js` – Express router for cart endpoints
- `route/orders.js` – Express router for order endpoints
- `public/` – Static frontend files (HTML, CSS, JS, images)
- `db/db.js` – SQLite database connection
- `db/models/User.js` – User model for database operations
- `db/models/Product.js` – Product model for database operations
- `db/models/Order.js` – Order model for database operations

## API Endpoints

- `GET /api/products` – List all products (supports `search` and `genreFilter` query params)
- `GET /api/products/genres` – List all available genres
- `GET /api/products/:id` – Retrieve a specific product by ID
- `POST /api/products` – Create a new product
- `PUT /api/products/:id` – Update a specific product by ID
- `DELETE /api/products/:id` – Delete a specific product by ID

## Screenshots

### Home Page

<img src="public/screenshot/home1.jpg" alt="Home Page" width="600" />

### Search Feature

<img src="public/screenshot/search1.jpg" alt="Search Example" width="600" />

### Dropdown Filter (Example 1)

<img src="public/screenshot/dropdown1.jpg" alt="Dropdown Filter 1" width="600" />

### Dropdown Filter (Example 2)

<img src="public/screenshot/dropdown2.jpg" alt="Dropdown Filter 2" width="600" />

### Sign-up

<img src="public/screenshot/signup.jpg" alt="Sign-Up" width="600" />

### Log-in

<img src="public/screenshot/LogIn.jpg" alt="Log-In" width="600" />

### Wrong password or username

<img src="public/screenshot/Wronglogin.jpg" alt="Wrong-Log-in" width="600" />

### Adding to cart

<img src="public/screenshot/addToCart.jpg" alt="adding-to-cart" width="600" />

### Account Cart

<img src="public/screenshot/Cart1.jpg" alt="Cart1" width="600" />

### Account Cart 2

<img src="public/screenshot/cart2.jpg" alt="Cart2" width="600" />

---

**Note:**  
This project is for learning and demonstration purposes. Feel free to explore and modify the code!
