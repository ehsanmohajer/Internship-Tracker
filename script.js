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

// Adding Time of Day to Login Page
function updateCurrentDay() {
  const dateInfo = document.getElementById("dateInfo");

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

  dateInfo.textContent = `Today is ${dayName}, ${dateNumber} ${monthName} ${year}`;
}

// Call this function when the page loads
updateCurrentDay();


// Utility Functions
function updateClock() {
  const now = new Date();
  currentDateTime.textContent = now.toLocaleString();
  setTimeout(updateClock, 1000);
}

function updateRemainingHours() {
  remainingHoursDisplay.textContent = data[currentUser].remainingHours.toFixed(2);
}

// // Handle Empty Logs Gracefully
  function renderLogs() {
  const logs = data[currentUser].logs || [];

  // Calculate total hours worked
  const totalWorkedHours = logs.reduce((sum, log) => sum + log.hours, 0);

  // Update remaining hours
  data[currentUser].remainingHours = logs.length > 0 ? 270 - totalWorkedHours : 270;

  // Update the total hours worked display
  totalHoursWorkedDisplay.textContent = totalWorkedHours.toFixed(2);

  // Update the remaining hours display
  updateRemainingHours();

  // Handle Empty Logs Gracefully
  workLog.innerHTML = logs.length > 0
    ? logs
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
              <button class="bg-yellow-400 text-white px-2 py-1 rounded-md hover:bg-yellow-500" onclick="editLog(${index})">Edit</button>
              <!-- Remove Button -->
              <button class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600" onclick="removeLog(${index})">Remove</button>
            </div>
          </li>`
        )
        .join("")
    : `<p class="text-gray-500">No logs yet. Start by adding a task!</p>`;

  // Save updated data to localStorage
  localStorage.setItem("data", JSON.stringify(data));
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

  

  // Clear Login Fields After Logout:
  logoutButton.addEventListener("click", () => {
    currentUser = null;
    loginPage.classList.remove("hidden");
    dashboard.classList.add("hidden");
    usernameInput.value = "";
    passwordInput.value = "";
  });
  


  // Render the logs
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
          <button class="bg-yellow-400 text-white px-2 py-1 rounded-md hover:bg-yellow-500" onclick="editLog(${index})">Edit</button>
          <!-- Remove Button -->
          <button class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600" onclick="removeLog(${index})">Remove</button>
        </div>
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
  if (users[username] === password) {
    currentUser = username;
    loginPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
    welcomeMessage.textContent = `Hello, ${currentUser}!`;
    updateClock(); // Start updating time dynamically
    renderLogs(); // Render the user's logs
  } else {
    alert("Invalid username or password.");
  }
});

//   if (users[username] !== password) {
//     alert("Invalid username or password.");
//     return;
//   }

//   currentUser = username;
//   loginPage.classList.add("hidden");
//   dashboard.classList.remove("hidden");

//   welcomeMessage.textContent = `Hello, ${currentUser}!`;
//   updateClock();
//   renderLogs();
// });

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
// managerButton.addEventListener("click", () => {
//   const enteredPassword = prompt("Enter the Manager Password:");
//   if (enteredPassword === managerPassword) {
//     loginPage.classList.add("hidden");
//     managerPage.classList.remove("hidden");

//     const userEntries = Object.entries(data);
//     managerList.innerHTML = userEntries
//       .map(
//         ([username, userData]) => `
//         <li class="bg-gray-200 p-4 rounded-lg">
//           <h3 class="text-lg font-bold">${username}</h3>
//           <p><strong>Remaining Hours:</strong> ${userData.remainingHours.toFixed(2)}</p>
//           <h4 class="font-bold mt-2">Work Logs:</h4>
//           <ul class="space-y-4 border-t border-gray-300 pt-2">
//             ${userData.logs
//               .map(
//                 (log, index) => `
//               <li class="border-b border-gray-300 pb-2 mb-2">
//                 <p><strong>Date:</strong> ${log.date}</p>
//                 <p><strong>Hours:</strong> ${log.hours}</p>
//                 <p><strong>Task:</strong> ${log.task}</p>
//               </li>`
//               )
//               .join("")}
//           </ul>
//         </li>`
//       )
//       .join("");
//   } else {
//     alert("Invalid Manager Password.");
//   }
// });

// begin of changes
managerButton.addEventListener("click", () => {
  const enteredPassword = prompt("Enter the Manager Password:");
  if (enteredPassword === managerPassword) {
    loginPage.classList.add("hidden");
    managerPage.classList.remove("hidden");

    renderManagerDashboard();
  } else {
    alert("Invalid Manager Password.");
  }
});

function renderManagerDashboard() {
  const userEntries = Object.entries(data);
  managerList.innerHTML = userEntries
    .map(
      ([username, userData]) => `
      <li class="bg-gray-200 p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold">${username}</h3>
          <button class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600" onclick="removeUser('${username}')">
            Remove
          </button>
        </div>
        <p><strong>Remaining Hours:</strong> ${userData.remainingHours.toFixed(2)}</p>
        <h4 class="font-bold mt-2">Work Logs:</h4>
        <ul class="space-y-4 border-t border-gray-300 pt-2">
          ${userData.logs
            .map(
              (log) => `
            <li class="border-b border-gray-300 pb-2 mb-2">
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
}

// Remove User
function removeUser(username) {
  if (confirm(`Are you sure you want to remove the user "${username}"?`)) {
    delete users[username];
    delete data[username];

    // Update localStorage
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("data", JSON.stringify(data));

    // Re-render the manager dashboard
    renderManagerDashboard();
  }
}

// // Create New User
// document.getElementById("createUserButton").addEventListener("click", () => {
//   const newUsername = document.getElementById("newUsername").value.trim();
//   const newPassword = document.getElementById("newPassword").value.trim();

//   if (!newUsername || !newPassword) {
//     alert("Both fields are required.");
//     return;
//   }

//   if (users[newUsername]) {
//     alert("Username already exists.");
//     return;
//   }

//   if (!isValidPassword(newPassword)) {
//     alert(
//       "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
//     );
//     return;
//   }

  // Add new user
  users[newUsername] = newPassword;
  data[newUsername] = { remainingHours: 270, logs: [] };

  // Update localStorage
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("data", JSON.stringify(data));

  // Clear input fields
  document.getElementById("newUsername").value = "";
  document.getElementById("newPassword").value = "";

  // Re-render the manager dashboard
  renderManagerDashboard();
  alert(`User "${newUsername}" created successfully.`);
});


// end of changes
backToLogin.addEventListener("click", () => {
  managerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

// Save Work
submitButton.addEventListener("click", () => {
  const startDate = document.getElementById("startDate").value;
  const startTime = parseInt(document.getElementById("startTime").value);
  const endTime = parseInt(document.getElementById("endTime").value);
  const taskDescription = document.getElementById("taskDescription").value.trim();

  if (!startDate || isNaN(startTime) || isNaN(endTime) || !taskDescription) {
    alert("All fields are required.");
    return;
  }

  if (endTime <= startTime) {
    alert("End time must be after start time.");
    return;
  }

  const hoursWorked = endTime - startTime;

  data[currentUser].logs.push({
    date: startDate,
    hours: hoursWorked,
    task: taskDescription,
    startTime,
    endTime,
  });

  localStorage.setItem("data", JSON.stringify(data));
  renderLogs();

  document.getElementById("startDate").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  document.getElementById("taskDescription").value = "";
});
// submitButton.addEventListener("click", () => {
//   const startDate = document.getElementById("startDate").value;
//   const startTime = parseInt(document.getElementById("startTime").value);
//   const endTime = parseInt(document.getElementById("endTime").value);
//   const taskDescription = document.getElementById("taskDescription").value.trim();

//   // Validate input fields
//   if (!startDate || isNaN(startTime) || isNaN(endTime) || !taskDescription) {
//     alert("All fields are required.");
//     return;
//   }

//   if (endTime <= startTime) {
//     alert("End time must be after start time.");
//     return;
//   }

//   const hoursWorked = endTime - startTime;

//   // Add the new work log
//   data[currentUser].logs.push({
//     date: startDate,
//     hours: hoursWorked,
//     task: taskDescription,
//     startTime,
//     endTime,
//   });

//   // Save updated logs and re-render
//   localStorage.setItem("data", JSON.stringify(data));
//   renderLogs();

//   // Clear input fields
//   document.getElementById("startDate").value = "";
//   document.getElementById("startTime").value = "";
//   document.getElementById("endTime").value = "";
//   document.getElementById("taskDescription").value = "";
// });

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

updateCurrentDay();