/// Dashboard Scripts

let storedUser = localStorage.getItem("activeUser");
let userData = JSON.parse(localStorage.getItem("user"));
console.log(userData);
//Display personalization with username
let name = document.getElementById("name");
name.innerText = userData.name;

let profileUsername = document.getElementById("profile-username");
let profileEmail = document.getElementById("profile-email");
let profilePhone = document.getElementById("profile-phone");
let profileDate = document.getElementById("profile-date");
let profileName = document.getElementById("profile-name");

//Display user Profile Details
profileUsername.innerHTML = userData.username;
profileEmail.innerHTML = userData.email;
profilePhone.innerHTML = userData.phone;
profileDate.innerHTML = new Date(userData.date).toLocaleDateString();
profileName.innerHTML = userData.name;

//Displaying Balance
let balanceKey = "balance_" + storedUser;
let balance = JSON.parse(localStorage.getItem(balanceKey)) || 0;
let balanceAmount = document.getElementById("balance-amount");
balanceAmount.innerHTML = "₹" + balance.toFixed(2);

//transaction actions
let transactions = document.getElementById("transactions");

let depositBtn = document.getElementById("deposit-btn");
let depositKey = "deposits_" + storedUser;
let deposits = JSON.parse(localStorage.getItem(depositKey)) || [];
depositBtn.addEventListener("click", () => {
  let depositAmount = parseFloat(
    document.getElementById("deposit-amount").value
  );
  let depositMessage = document.getElementById("deposit-message").value;
  let accountNumber = parseInt(document.getElementById("account-number").value);

  if (depositAmount > 0) {
    balance += depositAmount;
    localStorage.setItem(balanceKey, JSON.stringify(balance));
    balanceAmount.innerHTML = "₹" + balance.toFixed(2);
    alert("Deposit Successfull!..");
    document.getElementById("deposit-amount").value = "";
    document.getElementById("deposit-message").value = "";
    deposits.push({
      amount: depositAmount,
      message: depositMessage,
      date: new Date().toISOString(),
    });
    localStorage.setItem(depositKey, JSON.stringify(deposits));
    window.location.reload();
  } else {
    alert("Enter valid amount to deposit..");
  }
});
//View All Deposits Functionality
let viewDepositBtn = document.getElementById("view-deposits");
viewDepositBtn.addEventListener("click", () => {
  transactions.innerHTML = deposits.map((dep) => {
    // switch to deposits tab
    document
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector('.filter-btn[data-filter="deposit"]')
      .classList.add("active");
    return `
                    <div id="showDepositDiv">
                        <div class="history-item">
                            <div class="history-left">
                                <div class="history-icon deposit">💰</div>
                                <div class="history-details">
                                    <h4>Deposit</h4>
                                    <p>${dep.message || "No note added"}</p>
                                    <p class="history-date">${new Date(
                                      dep.date
                                    ).toLocaleDateString()}</p> 
                                </div>
                            </div>
                            <div class="history-right">
                                <div class="history-amount positive">+ ₹${dep.amount.toFixed(
                                  2
                                )}</div>  
                            </div>
                        </div>
                    </div>
                    </div>`;
  });
});

// total deposits display
let totalDepositsAmount =
  "₹ " + deposits.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2);
let totalDeposits = deposits.length;
console.log(totalDeposits);
let totalDepositsDisplay = document.getElementById("total-deposits");
totalDepositsDisplay.innerHTML = `${totalDepositsAmount}`;

//withDraw Functionality
let withdrawBtn = document.getElementById("withdraw-btn");
let withdrawkey = "withdrawals_" + storedUser;
let withdrawals = JSON.parse(localStorage.getItem(withdrawkey)) || [];
withdrawBtn.addEventListener("click", () => {
  let withdrawAmount = parseFloat(
    document.getElementById("withdraw-amount").value
  );
  if (!withdrawAmount || withdrawAmount <= 0) {
    alert("Insufficient Balance To withdraw..");
  }
  if (withdrawAmount > balance) {
    alert("Insufficient balance to withdraw..");
  }
  if (withdrawAmount > 0 && withdrawAmount <= balance) {
    balance -= withdrawAmount;
    localStorage.setItem(balanceKey, JSON.stringify(balance));
    balanceAmount.innerHTML = "₹" + balance.toFixed(2);
    alert("WithDrawal Successful!..");
    document.getElementById("withdraw-amount").value = "";
    withdrawals.push({
      amount: withdrawAmount,
      date: new Date().toISOString(),
    });
    localStorage.setItem(withdrawkey, JSON.stringify(withdrawals));
    window.location.reload();
  }
});

//View All Withdrawals Functionality
let viewWithdrawalBtn = document.getElementById("view-withdrawals");
viewWithdrawalBtn.addEventListener("click", () => {
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector('.filter-btn[data-filter="withdraw"]')
    .classList.add("active");

  transactions.innerHTML = withdrawals
    .map((w) => {
      return `
            <div class="history-item">
                <div class="history-left">
                    <div class="history-icon withdraw">💸</div>
                    <div class="history-details">
                        <h4>Withdrawal</h4>
                        <p>${w.message || "No note added"}</p>
                        <p class="history-date">${new Date(
                          w.date
                        ).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="history-right">
                    <div class="history-amount negative">- ₹${w.amount.toFixed(
                      2
                    )}</div>
                </div>
            </div>
        `;
    })
    .join("");
});

//total withdrawals display
let totalWithdrawals =
  "₹ " + withdrawals.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2);
let totalWithdrawalsDislplay = document.getElementById("total-withdrawals");
totalWithdrawalsDislplay.innerHTML = `${totalWithdrawals}`;

//total transactions display
let totalTransactions = deposits.length + withdrawals.length;
let totalTransactionsDisplay = document.getElementById("total-transactions");
totalTransactionsDisplay.innerHTML = `${totalTransactions}`;

//all transactions display
transactions.innerHTML = [
  ...deposits.map((deposit) => ({ ...deposit, type: "deposit" })),
  ...withdrawals.map((withdrawal) => ({ ...withdrawal, type: "withdraw" })),
]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((tran) => {
    if (tran.type === "deposit") {
      return `
                    <div id="showDepositDiv">
                        <div class="history-item">
                            <div class="history-left">
                                <div class="history-icon deposit">💰</div>
                                <div class="history-details">
                                    <h4>Deposit</h4>
                                    <p class="history-date">${new Date(
                                      tran.date
                                    ).toLocaleDateString()}</p> 
                                </div>
                            </div>
                            <div class="history-right">
                                <div class="history-amount positive">+ ₹${
                                  tran.amount ? tran.amount.toFixed(2) : "0.00"
                                }</div>  
                            </div>
                        </div>
                    </div>
                    </div>`;
    } else {
      return `
                    <div id="showDepositDiv">
                        <div class="history-item">
                            <div class="history-left">
                                <div class="history-icon withdraw">💸</div>
                                <div class="history-details">
                                    <h4>Withdrawal</h4>
                                    <p class="history-date">${new Date(
                                      tran.date
                                    ).toLocaleDateString()}</p> 
                                </div>
                            </div>
                            <div class="history-right">
                                <div class="history-amount negative">- ₹${tran.amount.toFixed(
                                  2
                                )}</div>  
                            </div>
                        </div>
                    </div>
                    </div>`;
    }
  })
  .join("");

//Hamburger menu functionality
let hanmburgerBtn = document.getElementById("hamburger-btn");
let dropdownMenu = document.getElementById("dropdown-menu");
hanmburgerBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("active");
  // hanmburgerBtn.classList.toggle("active")
  document.body.classList.toggle("overflow-hidden");
});

//Theme toggle functionality
let toggleBtn = document.getElementById("theme-toggle");
toggleBtn.onclick = () => {
  document.body.classList.toggle("light-theme");
};
//Logout Functionality
let logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  window.location.href = "login.html";
});

//Delete account funcionality
let deleteAccount = document.getElementById("delete-account");
deleteAccount.addEventListener("click", () => {
  let comfirmDelete = confirm(
    "Are you sure you want to delete your account? Thsi actioon can not be undone!.."
  );
  if (!comfirmDelete) {
    return;
  }
  localStorage.removeItem(depositKey);
  localStorage.removeItem(withdrawkey);
  localStorage.removeItem(balanceKey);
  localStorage.removeItem("activeUser");
  localStorage.removeItem("user");
  alert("Your account has been deleted successfully..");
  window.location.href = "login.html";
});
