const express = require("express");
const router = express.Router();

// ✅ IMPORT ONLY ONCE
const { addExpense, getExpenses, deleteExpense } = require("../controllers/expenseController");

const auth = require("../middleware/authMiddleware");

// ✅ ROUTES
router.post("/add", auth, addExpense);
router.get("/all", auth, getExpenses);
router.delete("/:id", auth, deleteExpense);

module.exports = router;