document.addEventListener("DOMContentLoaded", () => {

  console.log("Frontend JS Loaded ✅");

  // 🔐 Redirect if not logged in
  if (!localStorage.getItem("token")) {
    window.location.href = "auth.html";
    return;
  }

  // Elements
  const canvas = document.getElementById('expenseChart');
  const form = document.getElementById('expense-form');
  const limitForm = document.getElementById('limit-form');
  const limitDisplay = document.getElementById('current-limit');
  const warning = document.getElementById('warning-message');

  const ctx = canvas.getContext('2d');

  // State
  let expenseData = {};
  let totalAmount = 0;
  let chart;
  let expenseLimit = 0;

  const token = localStorage.getItem("token");

  // ---------------------------
  // 📊 Chart Update
  // ---------------------------
  function updateChart() {
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(expenseData),
        datasets: [{
          label: 'Expenses by Category',
          data: Object.values(expenseData),
          backgroundColor: '#3498db'
        }]
      }
    });
  }

  // ---------------------------
  // 💰 Total Update
  // ---------------------------
  function updateTotal() {
    document.getElementById('total-amount').textContent =
      `₹${totalAmount.toFixed(2)}`;
    checkLimit();
  }

  // ---------------------------
  // ⚠️ Limit Check
  // ---------------------------
  function checkLimit() {
    if (expenseLimit > 0 && totalAmount > expenseLimit) {
      warning.textContent = "⚠️ You crossed your limit!";
    } else {
      warning.textContent = "";
    }
  }

  // ---------------------------
  // 🎯 Set Limit
  // ---------------------------
  if (limitForm) {
    limitForm.addEventListener('submit', (e) => {
      e.preventDefault();

      expenseLimit = parseFloat(document.getElementById('limit').value);
      limitDisplay.textContent = `Current Limit: ₹${expenseLimit}`;

      checkLimit();
      limitForm.reset();
    });
  }

  // ---------------------------
  // 📥 LOAD EXPENSES FROM DB
  // ---------------------------
  async function loadExpenses() {
    try {
      const response = await fetch("http://localhost:5000/api/expenses/all", {
        headers: {
          "Authorization": token
        }
      });

      const data = await response.json();

      data.forEach(exp => {
        const { date, category, title, amount, _id } = exp;

        if (!expenseData[category]) {
          expenseData[category] = 0;
        }

        expenseData[category] += amount;
        totalAmount += amount;

        addRow(date, category, title, amount, _id);
      });

      updateChart();
      updateTotal();

    } catch (err) {
      console.error("Load error:", err);
    }
  }

  // ---------------------------
  // ➕ ADD ROW (Reusable)
  // ---------------------------
  function addRow(date, category, description, amount, id) {
    const tableBody = document
      .getElementById('expense-table')
      .querySelector('tbody');

    const newRow = tableBody.insertRow();

    newRow.insertCell(0).textContent = date;
    newRow.insertCell(1).textContent = category;
    newRow.insertCell(2).textContent = description;
    newRow.insertCell(3).textContent = amount.toFixed(2);

    // 🔥 DELETE BUTTON
    const deleteCell = newRow.insertCell(4);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.backgroundColor = "red";
    deleteBtn.style.color = "white";

    deleteBtn.onclick = async () => {
      try {
        await fetch(`http://localhost:5000/api/expenses/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": token
          }
        });

        newRow.remove();
        location.reload(); // simple refresh

      } catch (err) {
        console.error("Delete error:", err);
      }
    };

    deleteCell.appendChild(deleteBtn);
  }

  // ---------------------------
  // ➕ ADD EXPENSE
  // ---------------------------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    try {
      const response = await fetch("http://localhost:5000/api/expenses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          title: description,
          amount,
          category,
          date
        })
      });

      const data = await response.json();

      // update UI
      if (!expenseData[category]) {
        expenseData[category] = 0;
      }

      expenseData[category] += amount;
      totalAmount += amount;

      addRow(date, category, description, amount, data._id);

      updateChart();
      updateTotal();

      form.reset();

    } catch (err) {
      console.error("Add error:", err);
    }
  });

  // 🚀 INITIAL LOAD
  loadExpenses();

});