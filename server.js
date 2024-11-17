const express = require("express");
const path = require('path');
const cors = require("cors");
const connectDB = require("./config/DbConfig");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//Import Routes
const authRoutes = require("./routes/authRoutes"); // Authentication routes
const adminRoutes = require("./routes/adminRoutes")
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const dishRoutes = require("./routes/dishRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const cartRoutes = require("./routes/cartRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const addressRoutes = require('./routes/addressRoutes');
const promotionRoutes = require("./routes/promotionRoutes");

const app = express();

// Database connection
connectDB();

// Middleware
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'utils/templates')));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // For handling cookies
app.use(cors()); // Cross-origin resource sharing

// Routes
app.use("/api/auth/", authRoutes); // All authentication-related routes
app.use("/api/admin/",adminRoutes); //All admin-related Routes
app.use("/api/user/", userRoutes); // All Users-related routes
app.use("/api/restaurant/", restaurantRoutes); // All Users-related routes
app.use("/api/menu/", menuRoutes); // All Users-related routes
app.use("/api/dish/",dishRoutes); //All Dishes related Routes
app.use("/api/categories/",categoriesRoutes); //All Dishes related Routes
app.use("/api/cart/",cartRoutes); //All Dishes related Routes
app.use("/api/reviews",reviewRoutes); // All review related routes
app.use("/api/order",orderRoutes); // All order related routes
app.use('/api/search', searchRoutes); // All search related routes
app.use('/api/search', searchRoutes); // All search related routes
app.use('/api/notification', notificationRoutes); // All search related routes
app.use('/api/address', addressRoutes); // All search related routes
app.use('/api/promotions',promotionRoutes); //All promotion related routes


//dummy Home route
app.get("/home",(req,res)=>{
	res.json({"home":"This is the basic homepage just for testing"})
})

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
