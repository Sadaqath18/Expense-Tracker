const balance = document.getElementById("balance-amount");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Income", "Expense"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#4caf50", "#f44336"],
    }],
  },
  options: {
    maintainAspectRatio: true
  },
});

function addTransaction(e) {
  e.preventDefault();
  if (textInput.value.trim() === "" || amountInput.value.trim() === "") {
    alert("Please fill in both fields.");
    return;
  }
  const transaction = {
    id: Date.now(),
    text: textInput.value.trim(),
    amount: +amountInput.value.trim(),
  };
  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  textInput.value = "";
  amountInput.value = "";
}

// Add DOM transaction
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

// Update the balance, income, and expense totals
function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const incomeTotal = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expenseTotal = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerText = `₹${total}`;
  incomeEl.innerText = `+₹${incomeTotal}`;
  expenseEl.innerText = `-₹${expenseTotal}`;

  expenseChart.data.datasets[0].data = [Number(incomeTotal), Number(expenseTotal)];
  expenseChart.update();
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize the app
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
form.addEventListener("submit", addTransaction);
