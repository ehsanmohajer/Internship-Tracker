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

// Predefined Manager Password
const managerPassword = "ViitasaariTrainee2024";

// Utility Functions
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
      (log, index) => `
      <li class="bg-gray-200 p-4 rounded-lg flex justify-between items-start">
        <div>
          <p><strong>Date:</strong> ${log.date}</p>
          <p><strong>Hours Worked:</strong> ${log.hours}</p>
          <p><strong>Task:</strong> ${log.task}</p>
        </div>
        <div class="flex gap-2">
          <!-- Edit Button -->
          <button class="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-yellow-500" onclick="editLog(${index})">Edit</button>
          <!-- Remove Button -->
          <button class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600" onclick="removeLog(${index})">Remove</button>
        </div>
      </li>`
    )
    .join("");
}

function editLog(index) {
  const log = data[currentUser].logs[index];

  // Populate the input fields with the selected log's data
  document.getElementById("startDate").value = log.date;
  document.getElementById("startTime").value = log.startTime;
  document.getElementById("endTime").value = log.endTime;
  document.getElementById("taskDescription").value = log.task;

  // Remove the log from the list temporarily for editing
  data[currentUser].logs.splice(index, 1);

  // Save the updated logs and re-render
  localStorage.setItem("data", JSON.stringify(data));
  renderLogs();
}

function removeLog(index) {
  // Confirm before removing
  if (confirm("Are you sure you want to remove this log?")) {
    // Remove the log
    data[currentUser].logs.splice(index, 1);

    // Save the updated logs and re-render
    localStorage.setItem("data", JSON.stringify(data));
    renderLogs();
  }
}

// Password Validation
function isValidPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Registration
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

// Forgot Password
forgotPasswordButton.addEventListener("click", () => {
  const username = prompt("Enter your username to reset your password:");

  if (!username || !users[username]) {
    alert("User not found. Please enter a valid username.");
    return;
  }

  const newPassword = prompt(
    "Enter your new password (must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character):"
  );

  if (!newPassword || !isValidPassword(newPassword)) {
    alert(
      "Invalid password format. Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return;
  }

  users[username] = newPassword;
  localStorage.setItem("users", JSON.stringify(users));

  alert("Password has been reset successfully. You can now log in with your new password.");
});

// Manager Access
managerButton.addEventListener("click", () => {
  const enteredPassword = prompt("Enter the Manager Password:");
  if (enteredPassword === managerPassword) {
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
  } else {
    alert("Invalid Manager Password.");
  }
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

  if (endTime <= startTime) {
    alert("End time must be after start time.");
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

// Helper function to get the current date details
function updateWelcomeDate() {
  const dateInfoElement = document.getElementById("dateInfo");

  // Get current date
  const now = new Date();

  // Days and months arrays for friendly names
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Extract day, date, month, and year
  const dayName = days[now.getDay()];
  const dateNumber = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  // Set the text content
  dateInfoElement.textContent = `${dayName}, ${dateNumber} ${monthName} ${year}`;
}

// Call the function to update the welcome text
updateWelcomeDate();