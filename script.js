const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");

let transactions = [];

function updateValues() {
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expense;

  incomeEl.innerText = `₹${income}`;
  expenseEl.innerText = `₹${Math.abs(expense)}`;
  balanceEl.innerText = `₹${balance}`;
}

function addTransaction(e) {
  e.preventDefault();
  const text = form.transaction.value.trim();
  const amount = +form.amount.value.trim();

  if (text && amount) {
    const transaction = { id: Date.now(), text, amount };
    transactions.push(transaction);
    renderTransaction(transaction);
    updateValues();
    form.reset();
  }
}

function renderTransaction(transaction) {
  const li = document.createElement("li");
  li.textContent = `${transaction.text} (${transaction.amount > 0 ? "+" : "-"}₹${Math.abs(transaction.amount)})`;
  list.appendChild(li);
}

form.addEventListener("submit", addTransaction);
