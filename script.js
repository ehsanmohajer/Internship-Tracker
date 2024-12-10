// DOM Elements
const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
const currentDateTime = document.getElementById("currentDateTime");

const startDateInput = document.getElementById("startDate");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const taskDescriptionInput = document.getElementById("taskDescription");
const submitButton = document.getElementById("submitButton");
const remainingHoursDisplay = document.getElementById("remainingHours");
const workLog = document.getElementById("workLog");
const logoutButton = document.getElementById("logoutButton");

let users = JSON.parse(localStorage.getItem("users")) || {}; // Stores usernames and passwords
let data = JSON.parse(localStorage.getItem("data")) || {}; // Stores user-specific internship data
let currentUser = null;

// Password Validation Function
function isValidPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Update Data in Local Storage
function updateData() {
  localStorage.setItem("data", JSON.stringify(data));
}

// Update Users in Local Storage
function updateUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

// Update Clock
function updateClock() {
  const now = new Date();
  currentDateTime.textContent = now.toLocaleString();
  setTimeout(updateClock, 1000);
}

// Registration Functionality
registerButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Both fields are required.");
    return;
  }

  if (!isValidPassword(password)) {
    alert(
      "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return;
  }

  if (users[username]) {
    alert("Username already exists. Please choose a different one.");
    return;
  }

  users[username] = password;
  data[username] = { remainingHours: 270, logs: [] };
  updateUsers();
  updateData();

  currentUser = username;
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");

  updateClock();
  updateRemainingHours();
  renderLogs();

  usernameInput.value = "";
  passwordInput.value = "";
});

// Login Functionality
loginButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username && !password) {
    alert("Please enter your username and password.");
    return;
  }

  if (!username) {
    alert("Please enter your username.");
    return;
  }

  if (!password) {
    alert("Please enter your password.");
    return;
  }

  if (users[username] !== password) {
    alert("Invalid username or password.");
    return;
  }

  currentUser = username;

  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");

  updateClock();
  updateRemainingHours();
  renderLogs();
});

// Forgot Password
forgotPasswordButton.addEventListener("click", () => {
  const username = prompt("Enter your username:");
  if (!username || !users[username]) {
    alert("User not found.");
    return;
  }

  const newPassword = prompt("Enter your new password:");
  if (!isValidPassword(newPassword)) {
    alert(
      "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return;
  }

  users[username] = newPassword;
  updateUsers();
  alert("Password has been reset. You can now log in with your new password.");
});

// Save Work
submitButton.addEventListener("click", () => {
  const startDate = startDateInput.value || new Date().toISOString().split("T")[0];
  const startTime = parseInt(startTimeInput.value);
  const endTime = parseInt(endTimeInput.value);
  const taskDescription = taskDescriptionInput.value;

  if (!startDate || isNaN(startTime) || isNaN(endTime) || !taskDescription) {
    alert("All fields are required.");
    return;
  }

  if (endTime <= startTime) {
    alert("End time must be after start time.");
    return;
  }

  const hoursWorked = endTime - startTime;
  data[currentUser].remainingHours -= hoursWorked;

  data[currentUser].logs.push({
    date: startDate,
    hours: hoursWorked,
    task: taskDescription,
  });

  updateRemainingHours();
  renderLogs();
  updateData();

  startTimeInput.value = "";
  endTimeInput.value = "";
  taskDescriptionInput.value = "";
});

// Update Remaining Hours
function updateRemainingHours() {
  remainingHoursDisplay.textContent = data[currentUser].remainingHours.toFixed(2);
}

// Render Logs
function renderLogs() {
  const logs = data[currentUser].logs;
  workLog.innerHTML = logs
    .map(
      (log) => `
      <li class="bg-gray-200 p-4 rounded-lg">
        <p><strong>Date:</strong> ${log.date}</p>
        <p><strong>Hours Worked:</strong> ${log.hours}</p>
        <p><strong>Task:</strong> ${log.task}</p>
      </li>
    `
    )
    .join("");
}

// Logout Functionality
logoutButton.addEventListener("click", () => {
  currentUser = null;
  loginPage.classList.remove("hidden");
  dashboard.classList.add("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
});
