require("dotenv").config(); // ✅ ALWAYS FIRST

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// ✅ Connect Database
connectDB();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("TrackMySpend API Running");
});

// ✅ Routes
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// ✅ PORT (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});