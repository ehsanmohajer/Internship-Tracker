// DOM Elements
const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const managerPage = document.getElementById("managerPage");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const managerButton = document.getElementById("managerButton");
const backToLogin = document.getElementById("backToLogin");

const welcomeMessage = document.getElementById("welcomeMessage");
const currentDateTime = document.getElementById("currentDateTime");

const remainingHoursDisplay = document.getElementById("remainingHours");
const workLog = document.getElementById("workLog");
const managerList = document.getElementById("managerList");

const submitButton = document.getElementById("submitButton");
const logoutButton = document.getElementById("logoutButton");

let users = JSON.parse(localStorage.getItem("users")) || {}; // Stores usernames and passwords
let data = JSON.parse(localStorage.getItem("data")) || {}; // Stores user-specific internship data
let currentUser = null;

// Utility functions
function updateClock() {
  const now = new Date();
  currentDateTime.textContent = now.toLocaleString();
  setTimeout(updateClock, 1000);
}

function updateRemainingHours() {
  remainingHoursDisplay.textContent = data[currentUser].remainingHours.toFixed(2);
}

function renderLogs() {
  const logs = data[currentUser].logs;
  workLog.innerHTML = logs
    .map(
      (log) => `
      <li class="bg-gray-200 p-4 rounded-lg">
        <p><strong>Date:</strong> ${log.date}</p>
        <p><strong>Hours Worked:</strong> ${log.hours}</p>
        <p><strong>Task:</strong> ${log.task}</p>
      </li>`
    )
    .join("");
}

// Registration
registerButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Both fields are required.");
    return;
  }

  if (users[username]) {
    alert("Username already exists.");
    return;
  }

  users[username] = password;
  data[username] = { remainingHours: 270, logs: [] };
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("data", JSON.stringify(data));

  currentUser = username;
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");

  welcomeMessage.textContent = `Hello, ${currentUser}!`;
  updateClock();
  updateRemainingHours();
  renderLogs();
});

// Login
loginButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Both fields are required.");
    return;
  }

  if (users[username] !== password) {
    alert("Invalid username or password.");
    return;
  }

  currentUser = username;
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");

  welcomeMessage.textContent = `Hello, ${currentUser}!`;
  updateClock();
  updateRemainingHours();
  renderLogs();
});

// Manager Access
managerButton.addEventListener("click", () => {
  loginPage.classList.add("hidden");
  managerPage.classList.remove("hidden");

  const userEntries = Object.entries(data);
  managerList.innerHTML = userEntries
    .map(
      ([username, userData]) => `
      <li class="bg-gray-200 p-4 rounded-lg">
        <h3 class="text-lg font-bold">${username}</h3>
        <p><strong>Remaining Hours:</strong> ${userData.remainingHours.toFixed(2)}</p>
        <h4 class="font-bold mt-2">Work Logs:</h4>
        <ul>
          ${userData.logs
            .map(
              (log) => `
            <li class="pl-4">
              <p><strong>Date:</strong> ${log.date}</p>
              <p><strong>Hours:</strong> ${log.hours}</p>
              <p><strong>Task:</strong> ${log.task}</p>
            </li>`
            )
            .join("")}
        </ul>
      </li>`
    )
    .join("");
});

backToLogin.addEventListener("click", () => {
  managerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

// Save Work
submitButton.addEventListener("click", () => {
  const startDate = document.getElementById("startDate").value || new Date().toISOString().split("T")[0];
  const startTime = parseInt(document.getElementById("startTime").value);
  const endTime = parseInt(document.getElementById("endTime").value);
  const taskDescription = document.getElementById("taskDescription").value;

  if (!startDate || isNaN(startTime) || isNaN(endTime) || !taskDescription) {
    alert("All fields are required.");
    return;
  }

  const hoursWorked = endTime - startTime;
  data[currentUser].remainingHours -= hoursWorked;
  data[currentUser].logs.push({ date: startDate, hours: hoursWorked, task: taskDescription });

  localStorage.setItem("data", JSON.stringify(data));
  updateRemainingHours();
  renderLogs();

  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  document.getElementById("taskDescription").value = "";
});

// Logout
logoutButton.addEventListener("click", () => {
  currentUser = null;
  dashboard.classList.add("hidden");
  loginPage.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
});