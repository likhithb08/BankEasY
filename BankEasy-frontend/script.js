/// Dashboard Scripts
async function loadUser (){
  let response = await fetch("http://localhost:8080/api/auth/me", {
    credentials : "include"
  })
  if(!response.ok){
    window.location.href = "login.html"
    return
  }

  let user = await response.json();
  return user
}
let storedUser = null;
// //Display personalization with username
// let name = document.getElementById("name");
// name.innerText = userData.name;

// let profileUsername = document.getElementById("profile-username");
// let profileEmail = document.getElementById("profile-email");
// let profilePhone = document.getElementById("profile-phone");
// let profileDate = document.getElementById("profile-date");
// let profileName = document.getElementById("profile-name");

// //Display user Profile Details
// profileUsername.innerHTML = userData.username;
// profileEmail.innerHTML = userData.email;
// profilePhone.innerHTML = userData.phone;
// profileDate.innerHTML = new Date(userData.dateCreated).toLocaleDateString();
// profileName.innerHTML = userData.name;

async function initDashboard() {
    let userData = await loadUser();   // WAIT for user
    storedUser = userData.username;

    console.log(storedUser)

    // Fill UI
    document.getElementById("name").innerText = userData.name;
    document.getElementById("profile-username").innerText = userData.username;
    document.getElementById("profile-name").innerText = userData.name;
    document.getElementById("profile-email").innerText = userData.email;
    document.getElementById("profile-phone").innerText = userData.phone;
    document.getElementById("profile-date").innerText =
        new Date(userData.dateCreated).toLocaleDateString();

    // Load balance & stats
    await getBalance(storedUser);
    await viewTotalDeposit();
    await viewTotalWithdrawal();
    await viewTotalTransactions();
}

// 4. Call initializer
initDashboard();

//Displaying Balance
let balanceAmount = document.getElementById("balance-amount")
async function getBalance() {
  try {
    let response = await fetch(
      `http://localhost:8080/api/transactions/balance/${storedUser}`
    );
    let data = await response.json();
    balanceAmount.innerHTML = "₹" + data.toFixed(2)
    return data
  } catch (e) {
    alert(e);
  }
}
getBalance()

//transaction actions
let transactions = document.getElementById("transactions");
async function getTransactions(){
  try{
    let response = await fetch(`http://localhost:8080/api/transactions/history/${storedUser}`)
    return await response.json()
  }catch(e){
    alert(e)
  }
}

getTransactions()

async function loadTransactions(){
  let transactions = await getTransactions()
  return transactions
}
loadTransactions()

async function totalDeposits(){
  let transactions =  await loadTransactions()
  let deposits = transactions.filter((t) => t.type === "DEPOSIT")
  let total = deposits.reduce((acc, dep) => acc + dep.amount, 0)
  return total
}


let depositBtn = document.getElementById("deposit-btn");

depositBtn.addEventListener("click", async () => {
  let depositAmount = parseFloat(
    document.getElementById("deposit-amount").value
  );
  let depositMessage = document.getElementById("deposit-message").value;
  let accountNumber = parseInt(document.getElementById("account-number").value);

  let body = {
    username : storedUser,
    amount : depositAmount,
    note : depositMessage
  }
try{
  
  let response  = await fetch("http://localhost:8080/api/transactions/deposit",{
    method :'POST',
    headers:{
      "Content-Type" : "application/json"
    },
    body : JSON.stringify(body)

  })

  let data = await response.text();

  if(data === "User Not Found"){
    alert(data)
    console.log(data)
  }
  alert("Deposit Successful!")
  await getBalance()
}catch(e){
  alert(e)
}
});

//View All Deposits Functionality
let viewDepositBtn = document.getElementById("view-deposits");
let viewAllDeposits = async () => {
  console.log("view deposit clicked")

  let transactionsList = await loadTransactions()

  let deposit = transactionsList.filter((t) => t.type === "DEPOSIT")
  let transactionsCont = document.getElementById("transactions");
  transactionsCont.innerHTML = deposit.map((dep) => {
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
          <p>${dep.note || "No note added"}</p>
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
    </div>`

  }).join("")
};
viewDepositBtn.addEventListener("click",viewAllDeposits)

let seeAllDeposits = document.getElementById("view-all-deposits");
// seeAllDeposits.addEventListener("click",viewAllDeposits)


let viewTotalDeposits = document.getElementById("total-deposits") 
async function viewTotalDeposit(){
  let totalDep = await totalDeposits()
  viewTotalDeposits.innerHTML = "₹" + totalDep.toFixed(2)
}
viewTotalDeposit()

// withdrawal functionality

let withdrawBtn = document.getElementById("withdraw-btn")
withdrawBtn.addEventListener("click", async ()=>{
  let withdrawAmount = parseFloat(document.getElementById("withdraw-amount").value)
  let withdrawMsg = document.getElementById("withdraw-message").value

  let body = {
    username  : storedUser,
    amount : withdrawAmount,
    note : withdrawMsg
  }

  let response = await fetch("http://localhost:8080/api/transactions/withdraw",{
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify(body)
  })
  let data = response.text();
  if(data === "User Not Found"){
    alert(data)
    console.log(data)
  }
  alert("Withdrawal Successful!")
  await getBalance()

})

let totalWithdrawals = document.getElementById("total-withdrawals")
async function viewTotalWithdrawal(){
  let transactions = await loadTransactions()
  let withdrawls = transactions.filter((t)=> t.type === "WITHDRAW")
  let total = withdrawls.reduce((acc,w)=>acc + w.amount , 0)

  // return total

  totalWithdrawals.innerHTML = "₹" + total.toFixed(2)
}
viewTotalWithdrawal()


let viewWithdrawls = document.getElementById("view-withdrawals")
let viewAllWithdrawls = async ()=>{
  let transactionsList = await loadTransactions()
  let withdrawals = transactionsList.filter((t)=> t.type === "WITHDRAW")
  let transactionsCont = document.getElementById("transactions")
  transactionsCont.innerHTML = withdrawals.map((w)=>{
    // switch to withdrawls tab
    document
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector('.filter-btn[data-filter="withdraw"]')
      .classList.add("active");
    return `
    <div id="showWithdrawDiv">
    <div class="history-item">
    <div class="history-left">
      <div class="history-icon withdraw">💰</div>
      <div class="history-details">
        <h4>Withdrawal</h4>
        <p>${w.note || "No note added"}</p>
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
  </div>`
  }).join("")
}
viewWithdrawls.addEventListener("click",viewAllWithdrawls)

let seeAllWithdrawals = document.getElementById("view-all-withdrawals");
// seeAllWithdrawals.addEventListener("click",viewAllWithdrawls)
 

let totalTransactions = document.getElementById("total-transactions")
async function viewTotalTransactions(){
  let transactions = await loadTransactions()
  let total = transactions.length
  totalTransactions.innerHTML = total
}
viewTotalTransactions()



// Toggle Button
let toggleBtn = document.getElementById("theme-toggle")
let theme = localStorage.getItem("theme")
if(theme === 'light'){
  document.body.classList.add("light-theme")
}else{
  document.body.classList.add("dark-theme")
}
async function toggleTheme(){
  document.body.classList.toggle("light-theme")
  document.body.classList.toggle("dark-theme")

  const currentTheme = document.body.classList.contains("light-theme") ? "light" : "dark"

  localStorage.setItem("theme", currentTheme)
}
toggleBtn.addEventListener("click", toggleTheme)

//Hamburger
let hamburgerBtn = document.getElementById("hamburger-btn")
hamburgerBtn.addEventListener("click",async ()=>{
  let dropdownMenu = document.getElementById("dropdown-menu")
  dropdownMenu.classList.toggle("active")
})


//Logout 

let logoutBtn = document.getElementById("logout")

logoutBtn.addEventListener("click", async ()=>{
  let response = await fetch("http://localhost:8080/api/auth/logout",{
    method : "POST",
    credentials : "include"
  })
  window.location.href = "login.html"
})

//Delete Account

let deleteBtn = document.getElementById("delete-account")
deleteBtn.addEventListener("click", async ()=>{
  if(!confirm("Are you sure you want to delete the account?? think once again!")) return 

  await fetch("http://localhost:8080/api/auth/delete", {
    method : "DELETE",
    credentials : "include"
  })

  window.location.href = "home.html"
})



