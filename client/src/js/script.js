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
const forgotPasswordButton = document.getElementById("forgotPasswordButton");

const welcomeMessage = document.getElementById("welcomeMessage");
const currentDateTime = document.getElementById("currentDateTime");

const remainingHoursDisplay = document.getElementById("remainingHours");
const totalHoursWorkedDisplay = document.getElementById("totalHoursWorked");
const workLog = document.getElementById("workLog");
const managerList = document.getElementById("managerList");

// Elements for manager password
const managerPasswordContainer = document.getElementById("managerPasswordContainer");
const managerPasswordField = document.getElementById("managerPasswordField");
const confirmManagerAccess = document.getElementById("confirmManagerAccess");

// Elements for tasks in manager dashboard
const defineTaskButton = document.getElementById("defineTaskButton");
const taskDefinitionBox = document.getElementById("taskDefinitionBox");
const newTaskDescription = document.getElementById("newTaskDescription");
const addTaskButton = document.getElementById("addTaskButton");
const managerTasksList = document.getElementById("managerTasksList");

// Elements for user dashboard
const submitButton = document.getElementById("submitButton");
const logoutButton = document.getElementById("logoutButton");
const availableTasksContainer = document.getElementById("availableTasks");

// Manager Summary elements
const newButton = document.getElementById("newButton");
const managerSummaryBox = document.getElementById("managerSummaryBox");
const summaryUsers = document.getElementById("summaryUsers");
const summaryHours = document.getElementById("summaryHours");
const summaryTasks = document.getElementById("summaryTasks");

// Data from localStorage
let users = JSON.parse(localStorage.getItem("users")) || {}; 
let data = JSON.parse(localStorage.getItem("data")) || {}; 
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentUser = null;

let showSummary = false; // initially hidden

// Predefined Manager Password
const managerPassword = "admin";

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark") ? "enabled" : "disabled");
});

// Maintain dark mode preference on page load
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
}

// Utility Functions
function updateClock() {
  const now = new Date();
  currentDateTime.textContent = now.toLocaleString();
  setTimeout(updateClock, 1000);
}

function updateRemainingHours() {
  if (currentUser && data[currentUser]) {
    remainingHoursDisplay.textContent = data[currentUser].remainingHours.toFixed(2);
  }
}

function renderLogs() {
  const logs = data[currentUser].logs.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate total hours worked
  const totalWorkedHours = logs.reduce((sum, log) => sum + log.hours, 0);

  // Update remaining hours
  data[currentUser].remainingHours = logs.length > 0 ? 270 - totalWorkedHours : 270;

  // Update displays
  totalHoursWorkedDisplay.textContent = totalWorkedHours.toFixed(2);
  updateRemainingHours();

  workLog.innerHTML = logs
    .map(
      (log, index) => `
        <li class="log-item">
          <p><strong>Date:</strong> ${log.date}</p>
          <p><strong>Time:</strong> ${log.startTime}:00 - ${log.endTime}:00</p>
          <p><strong>Task:</strong> ${log.task}</p>
          <p><strong>Hours Worked:</strong> ${log.hours}</p>
          <div class="flex gap-2 mt-2">
              <button class="edit-log-btn bg-yellow-400 text-white px-2 py-1 rounded-md hover:bg-yellow-500" onclick="editLog(${index})">Edit</button>
              <button class="remove-log-btn bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600" onclick="removeLog(${index})">Remove</button>
          </div>
        </li>`
    )
    .join("");

  localStorage.setItem("data", JSON.stringify(data));
}

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
  renderLogs();
  renderAvailableTasksForUser(); // After successful registration
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
  renderLogs();
  renderAvailableTasksForUser(); // After successful login
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
  managerPasswordContainer.classList.remove("hidden");
});

confirmManagerAccess.addEventListener("click", () => {
  const enteredPassword = managerPasswordField.value.trim();

  if (enteredPassword === managerPassword) {
    // Hide login page, show manager page
    loginPage.classList.add("hidden");
    managerPage.classList.remove("hidden");

    // Render Manager Dashboard
    renderManagerDashboard();

    managerPasswordField.value = "";
    managerPasswordContainer.classList.add("hidden");
  } else {
    alert("Invalid Manager Password.");
  }
});

backToLogin.addEventListener("click", () => {
  managerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

// Define a Task functionality
defineTaskButton.addEventListener("click", () => {
  taskDefinitionBox.classList.toggle("hidden");
});

addTaskButton.addEventListener("click", () => {
  const description = newTaskDescription.value.trim();
  if (!description) {
    alert("Task description cannot be empty.");
    return;
  }

  const newTask = {
    id: 'task_' + Date.now(),
    description: description,
    assignedTo: null
  };
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  newTaskDescription.value = "";
  taskDefinitionBox.classList.add("hidden");
  renderManagerDashboard(); // Re-render the manager dashboard to show new task
});

// Submit (save) Work
submitButton.addEventListener("click", () => {
  const startDate = document.getElementById("startDate").value;
  const startTime = parseInt(document.getElementById("startTime").value);
  const endTime = parseInt(document.getElementById("endTime").value);
  const taskDescription = document.getElementById("taskDescription").value.trim();

  // Validate input fields
  if (!startDate || isNaN(startTime) || isNaN(endTime) || !taskDescription) {
    alert("All fields are required.");
    return;
  }

  const today = new Date().setHours(0, 0, 0, 0); 
  const inputDate = new Date(startDate).setHours(0, 0, 0, 0); 

  // Validate date not in future
  if (inputDate > today) {
    alert("You cannot log work for future dates.");
    return;
  }

  if (endTime <= startTime) {
    alert("End time must be after start time.");
    return;
  }

  // Validate time input
  if (
    startTime < 1 ||
    startTime > 24 ||
    endTime < 1 ||
    endTime > 24 ||
    endTime <= startTime
  ) {
    alert(
      "Invalid time input: Start Time and End Time must be between 1 and 24, and End Time must be greater than Start Time."
    );
    return;
  }

  const hoursWorked = endTime - startTime;

  // Check for overlapping times on the same date
  const existingLogs = data[currentUser].logs.filter((log) => log.date === startDate);
  const hasOverlap = existingLogs.some(
    (log) =>
      (startTime >= log.startTime && startTime < log.endTime) ||
      (endTime > log.startTime && endTime <= log.endTime) ||
      (startTime <= log.startTime && endTime >= log.endTime)
  );

  if (hasOverlap) {
    alert("The time range overlaps with an existing log for this date.");
    return;
  }

  // Add the new work log
  data[currentUser].logs.push({
    date: startDate,
    startTime,
    endTime,
    hours: hoursWorked,
    task: taskDescription,
  });

  // Save updated logs and re-render
  localStorage.setItem("data", JSON.stringify(data));
  renderLogs();

  // Clear input fields
  document.getElementById("startDate").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  document.getElementById("taskDescription").value = "";
});

// Edit Work Log
function editLog(index) {
  const log = data[currentUser].logs[index];

  // Populate input fields
  document.getElementById("startDate").value = log.date;
  document.getElementById("startTime").value = log.startTime;
  document.getElementById("endTime").value = log.endTime;
  document.getElementById("taskDescription").value = log.task;

  // Remove the selected log
  data[currentUser].logs.splice(index, 1);

  renderLogs();
}

// Remove Work Log
function removeLog(index) {
  if (confirm("Are you sure you want to remove this log?")) {
    data[currentUser].logs.splice(index, 1);
    renderLogs();
  }
}

// Logout
logoutButton.addEventListener("click", () => {
  currentUser = null;
  dashboard.classList.add("hidden");
  loginPage.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
});

// Toggle the summary on newButton click
newButton.addEventListener("click", () => {
  showSummary = !showSummary;
  renderManagerDashboard();
});

let showUserInfo = false; // new variable for user info visibility

// Existing code ...

const userInfoButton = document.getElementById("userInfoButton");

userInfoButton.addEventListener("click", () => {
  // Toggle user info visibility
  showUserInfo = !showUserInfo;

  // Re-render manager dashboard to reflect changes
  renderManagerDashboard();
});

function renderManagerDashboard() {
  renderManagerTasks();

  // Render user details (managerList)
  const managerListElement = document.getElementById("managerList");
  managerListElement.innerHTML = Object.entries(data).map(([username, userData]) => {
    const sortedLogs = userData.logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    const totalUserHours = userData.logs.reduce((sum, log) => sum + log.hours, 0);

    return `
      <li class="user-item">
        <div class="flex justify-between items-center">
          <h3><strong>User:</strong> "${username}"</h3>
          <button class="remove-user-btn bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600" onclick="removeUser('${username}')">X</button>
        </div>
        <div class="mb-4"></div>
        <p class="text-gray-600 mt-2 mb-4"><strong>Total Working Hours:</strong> ${totalUserHours.toFixed(2)}</p>
        <ul>
          ${sortedLogs.map(log => `
            <li class="log-item">
              <p><strong>Date:</strong> ${log.date}</p>
              <p><strong>Time:</strong> ${log.startTime}:00 - ${log.endTime}:00</p>
              <p><strong>Task:</strong> ${log.task}</p>
              <p><strong>Hours Worked:</strong> ${log.hours}</p>
            </li>`).join("")}
        </ul>
        <hr class="user-separator">
      </li>`;
  }).join("");

  // Control managerList visibility based on showUserInfo
  if (showUserInfo) {
    managerListElement.classList.remove("hidden");
  } else {
    managerListElement.classList.add("hidden");
  }

  // If showSummary is true, calculate and show the summary
  const managerSummaryBox = document.getElementById("managerSummaryBox");
  if (showSummary) {
    const numberOfUsers = Object.keys(data).length;
    const totalWorkingHours = Object.values(data).reduce(
      (sum, user) => sum + user.logs.reduce((userSum, log) => userSum + log.hours, 0),
      0
    );
    const totalTasks = Object.values(data).reduce((sum, user) => sum + user.logs.length, 0);

    document.getElementById("summaryUsers").textContent = numberOfUsers;
    document.getElementById("summaryHours").textContent = totalWorkingHours.toFixed(2);
    document.getElementById("summaryTasks").textContent = totalTasks;

    managerSummaryBox.classList.remove("hidden");
  } else {
    managerSummaryBox.classList.add("hidden");
  }
}


function renderManagerTasks() {
  managerTasksList.innerHTML = tasks.map(task => {
    return `
     <li class="task-item border border-gray-300 rounded-lg p-2 flex justify-between items-center">
        <div>
          <p><strong>Task:</strong> ${task.description}</p>
          <p><strong>Assigned To:</strong> ${task.assignedTo ? task.assignedTo : "Not Assigned"}</p>
        </div>
        <button 
          class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 ml-2" 
          onclick="removeTask('${task.id}')">
          X
        </button>
      </li>
    `;
  }).join("");
}

function removeTask(taskId) {
  if (confirm("Are you sure you want to remove this task?")) {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return; // Task not found

    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderManagerDashboard();
  }
}

function removeUser(username) {
  if (confirm(`Are you sure you want to remove user "${username}"?`)) {
    delete users[username];
    delete data[username];

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("data", JSON.stringify(data));

    renderManagerDashboard();
    alert(`User "${username}" has been successfully removed.`);
  }
}

// Available Tasks for User
function renderAvailableTasksForUser() {
  if (!currentUser || !availableTasksContainer) return;
  
  const available = tasks.filter(t => t.assignedTo === null);
  availableTasksContainer.innerHTML = available.map(task => {
    return `
      <li class="border border-gray-300 rounded-lg p-2 flex justify-between items-center">
        <span>${task.description}</span>
        <button class="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600" onclick="claimTask('${task.id}')">
          Claim Task
        </button>
      </li>
    `;
  }).join("");
}

function claimTask(taskId) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  tasks[taskIndex].assignedTo = currentUser;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderAvailableTasksForUser();
  alert(`You have claimed the task: "${tasks[taskIndex].description}"`);
}

// Utility function to update current day
function updateCurrentDay() {
  const currentDayElement = document.getElementById("currentDay");

  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayName = days[now.getDay()];
  const dateNumber = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  currentDayElement.textContent = `Today is ${dayName}, ${dateNumber} ${monthName} ${year}`;
}

// On page load
updateCurrentDay();
