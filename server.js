const express = require("express");
const cocktailsRoutes = require("./routes/cocktail");
const ingredientsRoutes = require("./routes/ingredientsRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3006;

// Middleware
app.use(cors()); // <- najpierw CORS
app.use(express.json());

// Trasy
app.use("/api", authRoutes);
app.use("/cocktails", cocktailsRoutes);
app.use("/ingredients", ingredientsRoutes);

// Start serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
