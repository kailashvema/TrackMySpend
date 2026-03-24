const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("TrackMySpend API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();
const expenseRoutes = require("./routes/expenseRoutes");

app.use("/api/expenses", expenseRoutes);
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
console.log("Routes loaded");