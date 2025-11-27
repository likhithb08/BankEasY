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

      const storedUser = localStorage.getItem("activeUser");
      const userData = JSON.parse(localStorage.getItem("user"));
      const deposits =
        JSON.parse(localStorage.getItem("deposits_" + storedUser)) || [];
      const widthdraws =
        JSON.parse(localStorage.getItem("withdrawals_" + storedUser)) || [];
      const balance =
        JSON.parse(localStorage.getItem("balance_" + storedUser)) || 0;

      function normalizeDeposits(deposits) {
        return deposits.map((d) => {
          if (typeof d === "object") {
            return {
              amount: d.amount,
              message: d.message || "",
              date: d.date || new Date().toISOString(),
            };
          }
          return {
            amount: d,
            message: "",
            date: new Date().toISOString(),
          };
        });
      }

      function normalizeWithdraws(withdraws) {
        return withdraws.map((w) => {
          if (typeof w === "object") {
            return {
              amount: w.amount,
              date: w.date || new Date().toISOString(),
            };
          }
          return {
            amount: w,
            date: new Date().toISOString(),
          };
        });
      }

      //prepare payload
      const payload = {
        user: storedUser,
        question: message,
        deposits: normalizeDeposits(deposits),
        withdraws: normalizeWithdraws(widthdraws),
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
