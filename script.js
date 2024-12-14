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
const totalHoursWorkedDisplay = document.getElementById("totalHoursWorked");
const workLog = document.getElementById("workLog");
const managerList = document.getElementById("managerList");

const submitButton = document.getElementById("submitButton");
const logoutButton = document.getElementById("logoutButton");

let users = JSON.parse(localStorage.getItem("users")) || {}; // Stores usernames and passwords
let data = JSON.parse(localStorage.getItem("data")) || {}; // Stores user-specific internship data
let currentUser = null;

// Predefined Manager Password
const managerPassword = "admin";

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

  // Calculate total hours worked
  const totalWorkedHours = logs.reduce((sum, log) => sum + log.hours, 0);

  // Update remaining hours (ensure it's reset when no logs exist)
  data[currentUser].remainingHours = logs.length > 0 ? 270 - totalWorkedHours : 270;

  // Update the total hours worked display
  totalHoursWorkedDisplay.textContent = totalWorkedHours.toFixed(2);

  // Update the remaining hours display
  updateRemainingHours();

  // Render the logs
  // workLog.innerHTML = logs
  //   .map(
  //     (log, index) => `
  //     <li class="bg-gray-200 p-4 rounded-lg flex justify-between items-start">
  //       <div>
  //         <p><strong>Date:</strong> ${log.date}</p>
  //         <p><strong>Hours Worked:</strong> ${log.hours}</p>
  //         <p><strong>Task:</strong> ${log.task}</p>
  //       </div>
  //       <div class="flex gap-2">
  //         <!-- Edit Button -->
  //         <button class="bg-yellow-400 text-white px-2 py-1 rounded-md hover:bg-yellow-500" onclick="editLog(${index})">Edit</button>
  //         <!-- Remove Button -->
  //         <button class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600" onclick="removeLog(${index})">Remove</button>
  //       </div>
  //     </li>`
  //   )
  //   .join("");
  workLog.innerHTML = logs
  .map(
    (log) => `
    <li class="bg-gray-200 p-4 rounded-lg">
      <p><strong>Date:</strong> ${log.date}</p>
      <p><strong>Time:</strong> ${log.startTime}:00 - ${log.endTime}:00</p>
      <p><strong>Task:</strong> ${log.task}</p>
      <p><strong>Hours Worked:</strong> ${log.hours}</p>
    </li>`
  )
  .join("");

  // Save updated data to localStorage
  localStorage.setItem("data", JSON.stringify(data));
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
    // Switch to Manager Page
    loginPage.classList.add("hidden");
    managerPage.classList.remove("hidden");

    // Render Manager Dashboard
    renderManagerDashboard();
  } else {
    // Invalid Password Alert
    alert("Invalid Manager Password.");
  }
});


backToLogin.addEventListener("click", () => {
  managerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

// submit (save) Work
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
      (startTime >= log.startTime && startTime < log.endTime) || // Start time overlaps
      (endTime > log.startTime && endTime <= log.endTime) ||    // End time overlaps
      (startTime <= log.startTime && endTime >= log.endTime)    // Enveloping range
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

  // Populate input fields with the selected log's data
  document.getElementById("startDate").value = log.date;
  document.getElementById("startTime").value = log.startTime;
  document.getElementById("endTime").value = log.endTime;
  document.getElementById("taskDescription").value = log.task;

  // Remove the selected log for editing
  data[currentUser].logs.splice(index, 1);

  // Recalculate remaining hours and re-render
  renderLogs();
}

// Remove Work Log
function removeLog(index) {
  if (confirm("Are you sure you want to remove this log?")) {
    // Remove the log
    data[currentUser].logs.splice(index, 1);

    // Recalculate remaining hours and re-render logs
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

function renderManagerDashboard() {
  // Calculate summary statistics
  const numberOfUsers = Object.keys(data).length;
  const totalWorkingHours = Object.values(data)
    .reduce((sum, user) => sum + user.logs.reduce((userSum, log) => userSum + log.hours, 0), 0);
  const totalTasks = Object.values(data).reduce((sum, user) => sum + user.logs.length, 0);

  // Render user details
  managerList.innerHTML = Object.entries(data)
    .map(
      ([username, userData]) => {
        const totalWorkedHours = userData.logs.reduce((sum, log) => sum + log.hours, 0);

        return `
          <li class="bg-gray-200 p-4 rounded-lg flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-bold">User: ['${username}']</h3>
              <p><strong>Remaining Hours:</strong> ${userData.remainingHours.toFixed(2)}</p>
              <p><strong>Total Working Hours:</strong> ${totalWorkedHours.toFixed(2)}</p>
              <h4 class="font-bold mt-2">Work Logs:</h4>
              <ul class="space-y-2 border-t border-gray-300 pt-2">
                ${userData.logs
                  .map(
                    (log) => `
                      <li class="border-b border-gray-300 pb-2">
                        <p><span class="text-blue-500 font-medium">Date:</span> ${log.date}</p>
                        <p><span class="text-blue-500 font-medium">Hours:</span> ${log.hours}</p>
                        <p><span class="text-blue-500 font-medium">Task:</span> ${log.task}</p>
                      </li>`
                  )
                  .join("")}
              </ul>
            </div>
            <!-- Remove User Button -->
            <div class="flex justify-end mt-4">
              <button 
                class="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-red-600" 
                onclick="removeUser('${username}')">Remove User</button>
            </div>
          </li>`;
      }
    )
    .join("");

  // Remove existing summary if it exists
  const existingSummary = document.getElementById("managerSummary");
  if (existingSummary) {
    existingSummary.remove();
  }

  // Add summary section
  const summaryHTML = `
    <div id="managerSummary" class="mt-6 bg-gray-100 p-4 rounded-lg">
      <h3 class="text-xl font-bold text-blue-500">Manager Summary</h3>
      <p class="mt-2 text-lg font-medium text-gray-700">Number of Users: <span class="text-blue-600 font-bold">${numberOfUsers}</span></p>
      <p class="mt-1 text-lg font-medium text-gray-700">Total Working Hours: <span class="text-blue-600 font-bold">${totalWorkingHours.toFixed(2)}</span></p>
      <p class="mt-1 text-lg font-medium text-gray-700">Total Tasks Completed: <span class="text-blue-600 font-bold">${totalTasks}</span></p>
    </div>
  `;

  // Append summary to the manager dashboard
  managerList.insertAdjacentHTML("afterend", summaryHTML);
}
function removeUser(username) {
  if (confirm(`Are you sure you want to remove user "${username}"?`)) {
    // Remove user from users and data
    delete users[username];
    delete data[username];

    // Update localStorage
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("data", JSON.stringify(data));

    // Re-render manager dashboard
    renderManagerDashboard();
    alert(`User "${username}" has been successfully removed.`);
  }
}


// Utility Functions
function updateCurrentDay() {
  const currentDayElement = document.getElementById("currentDay");

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
  currentDayElement.textContent = `Today is ${dayName}, ${dateNumber} ${monthName} ${year}`;
}

// Call the function on page load
updateCurrentDay();
