// AI Chat Functionality

// AI end-point script
const N8N_AI_URL = "http://localhost:5678/webhook/bankeasy-ai";
document.addEventListener("DOMContentLoaded", function () {
  const chatBtn = document.getElementById("ai-chat-btn");
  const chatWindow = document.getElementById("chat-window");
  const closeChat = document.getElementById("close-chat");
  const sendBtn = document.getElementById("send-message");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  // Toggle chat window
  chatBtn.addEventListener("click", function () {
    chatWindow.classList.toggle("active");
  });

  // Close chat window
  closeChat.addEventListener("click", function () {
    chatWindow.classList.remove("active");
  });

  // Send message
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      // Add user message
      addMessage(message, "user");
      chatInput.value = "";

      const userData = JSON.parse(localStorage.getItem("user"));
      const storedUser = userData ? userData.username : null;
      
      let balance = 0;
      let deposits = [];
      let withdrawals = [];

      if (storedUser) {
          try {
              // Fetch Balance
              const balanceRes = await fetch(`http://127.0.0.1:8080/api/transactions/balance/${storedUser}`);
              if (balanceRes.ok) {
                  balance = await balanceRes.json();
              }

              // Fetch History
              const historyRes = await fetch(`http://127.0.0.1:8080/api/transactions/history/${storedUser}`);
              if (historyRes.ok) {
                  const history = await historyRes.json();
                  deposits = history.filter(t => t.type === 'DEPOSIT');
                  withdrawals = history.filter(t => t.type === 'WITHDRAW');
              }
          } catch (err) {
              console.error("Error fetching user financial data:", err);
          }
      }

      function normalizeDeposits(deposits) {
        return deposits.map((d) => {
            return {
              amount: d.amount,
              message: d.note || "",
              date: d.date || new Date().toISOString(),
            };
        });
      }

      function normalizeWithdraws(withdraws) {
        return withdraws.map((w) => {
            return {
              amount: w.amount,
              date: w.date || new Date().toISOString(),
            };
        });
      }

      //prepare payload
      const payload = {
        user: storedUser,
        question: message,
        deposits: normalizeDeposits(deposits),
        withdraws: normalizeWithdraws(withdrawals),
        balance: balance,
      };

      try {
        // send to ai endpoint
        const response = await fetch(N8N_AI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json()
        console.log(data);
        addMessage(data.output, "ai");
      } catch (e) {
        console.error("Error in connection");
        addMessage("Error connecting to AI services");
      }
    }
  }

  sendBtn.addEventListener("click", sendMessage);

  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
