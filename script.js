// 🎙️ VOICE TO TEXT
const micbtn = document.getElementById("micbtn");
const chatingZone = document.getElementById("chatingZone");
const listen = window.SpeechRecognition || window.webkitSpeechRecognition;
const listener = new listen();
listener.continuous = false;
listener.lang = "en-US";

micbtn.addEventListener("click", () => {
  micbtn.style.background = "red";
  listener.start();
});

chatingZone.value = "";

listener.onresult = (event) => {
  const result = event.results[0][0].transcript;
  chatingZone.value = result;
  micbtn.style.background = "#4CAF50";
};

// 💬 CHAT LOGIC
const chatShows = document.getElementById("chats");
const sendbtn = document.getElementById("sendbtn");
const fileInput = document.getElementById("fileUplod");

sendbtn.addEventListener("click", () => {
  const userMessage = chatingZone.value.trim();
  if (userMessage === "") return;

  // user message bubble
  const userMessageNew = document.createElement("div");
  userMessageNew.classList.add("message", "user");
  userMessageNew.innerText = userMessage;
  chatShows.appendChild(userMessageNew);
  chatShows.scrollTop = chatShows.scrollHeight;

  DataChatReply(userMessage);
  chatingZone.value = "";
  fileInput.value = "";
});

chatingZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendbtn.click();
});

// 🤖 AI REPLY
async function DataChatReply(message) {
  const eReply = {
    "tell me about bhavesh education":
      "Bhavesh Sharma is currently pursuing BTech in Computer Science Engineering at Lakshmi Devi Institute of Technology and Engineering, Alwar Rajasthan. He aims to become an excellent Frontend Developer and Web Pentester. This ChatFinity AI is also created by Bhavesh Sharma. For more details, visit his portfolio or contact at: Bhaveshyt.infinity@gmail.com.",
    "who is bhavesh sharma":
      "Founder of ChatFinity AI is Bhavesh Sharma. Check his portfolio: https://bhavesh189.github.io/portfolio"
  };

  const userMsgLower = message.toLowerCase();

  // show loading
  const loadingMessage = document.createElement("div");
  loadingMessage.classList.add("message", "dataChat");
  loadingMessage.innerText = "Please wait... I’m thinking 🤔";
  chatShows.appendChild(loadingMessage);
  chatShows.scrollTop = chatShows.scrollHeight;

  // predefined reply
  if (eReply[userMsgLower]) {
    setTimeout(() => {
      loadingMessage.innerText = eReply[userMsgLower];
      chatShows.scrollTop = chatShows.scrollHeight;
    }, 600);
    return;
  }

  // 🔗 BACKEND API CALL (replace with your deployed backend URL)
  try {
    const res = await fetch("https://back-843v.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Backend reply:", data);

    // show AI reply in chat
    setTimeout(() => {
      loadingMessage.innerText = data.reply;
      chatShows.scrollTop = chatShows.scrollHeight;
    }, 800);

  } catch (err) {
    console.error("Fetch error:", err);
    loadingMessage.innerText = "⚠️ Sorry, something went wrong while connecting to AI!";
  }
}

// 🧭 SIDEBAR
let sidebar = document.querySelector(".sidebar");
let threedots = document.querySelector(".toggle-btn");
threedots.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// 👤 GOOGLE LOGIN TOGGLE
const account = document.querySelector(".account");
const googleLogin = document.getElementById("googleLogin");
account.addEventListener("click", () => {
  googleLogin.classList.toggle("active");
});

// 🚪 LOGOUT
const logoutBar = document.querySelector(".logoutBar");
const logoutOptions = document.querySelector(".logout");
logoutBar.addEventListener("click", () => {
  logoutOptions.classList.toggle("active");
});

// 🌐 AUTO PROMPT (portfolio link param)
window.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("chatingZone");
  const params = new URLSearchParams(window.location.search);
  const autoPrompt = params.get("prompt");

  if (autoPrompt) {
    inputBox.value = decodeURIComponent(autoPrompt);
    sendbtn.click();
  }
});



