const express = require("express");
const cors = require("cors");

// Database
const db = require("./config/database");

// Routes
const userRoutes = require("./routes/usersRoute");
const manufacturerRoutes = require("./routes/manufacturerRoute");
const productsRoutes = require("./routes/productsRoute");
const PLRoutes = require("./routes/PLRoute");
const categoryRoutes = require("./routes/categoryRoute");

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Test the connection
db.authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

const User = require("./models/users"); // Import the User model

// get request
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/users", userRoutes);
app.use("/manufacturer", manufacturerRoutes);
app.use("/products", productsRoutes);
app.use("/PL", PLRoutes);
app.use("/category", categoryRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
