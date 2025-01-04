# Internship Tracker

A MERN (MongoDB, Express.js, React, Node.js) stack architecture and web application for students to track their internship hours. This app provides user and manager dashboards to log, monitor, and manage internship progress. It includes a backend server connected to a MongoDB database for data persistence.

---

## Project Tree Structure (Old ver)

```plaintext
Internship-Tracker/
├── .env                    # Environment variables (MongoDB URI and other secrets)
├── index.html              # Frontend HTML structure
├── package.json            # Node.js dependencies and scripts
├── script.js               # Frontend JavaScript (logic and API calls)
├── server/                 # Backend folder
│   ├── server.js           # Main backend server setup
│   ├── models/             # Mongoose schemas
│   │   └── User.js         # User schema and log schema
│   ├── routes/             # API route handlers
│   │   ├── logRoutes.js    # Routes for work logs (add, retrieve)
│   │   └── userRoutes.js   # Routes for user authentication (register, login)
```

## Project Tree Structure (New ver)

```plaintext
Internship-Tracker/
├── client/               # Frontend code
│   ├── public/           # Static files (e.g., index.html, assets)
│   │   └── index.html    # Main HTML file
│   └── src/              # Frontend source code
│       ├── assets/       # Images, fonts, etc.
│       ├── css/          # CSS files
│       | └── style.css   # style.css
│       ├── js/           # JavaScript files
│       | └── script.js   # script.js
│       └── components/   # Reusable UI components (if using React or similar)
│
├── server/               # Backend code
│   ├── models/           # Database models
│   │   └── User.js       # User model
│   ├── routes/           # API routes
|   |   └── logRoutes.js  # logRoutes.js
|   |   └── userRoutes.js # userRoutes.js
│   ├── controllers/      # Business logic for routes (optional, for better separation)
│   ├── middleware/       # Custom middleware (e.g., auth middleware)
│   ├── config/           # Configuration files (e.g., database connection)
│   ├── utils/            # Utility functions (e.g., JWT helpers)
│   └── Server.js         # Backend dependencies
│
├── .env                  # Environment variables (ignored by Git)
├── .gitignore            # Files/folders to ignore in Git
├── License               # License
├── package.json          # Root-level dependencies (if using a monorepo setup)
├── README.md             # Project overview and setup instructions
└── vercel.json           # Vercel configuration for deployment
```

---

## Features

### User Dashboard
- **Registration** and **Login** with password validation. User passwords are securely hashed using bcrypt before being stored in the database.
- Log daily working hours and tasks.
- Track remaining internship hours.
- View real-time clock and work logs.

### Manager Dashboard
- View all users, their remaining hours, and work logs.
- Remove users if necessary.

---

## Technologies

### Frontend
- **HTML**: Structure of the user interface.
- **CSS (Tailwind)**: Styling and layout.
- **JavaScript**: Core functionality and interaction with the backend.

### Backend
- **Node.js**: Backend server.
- **Express.js**: API routes and middleware.
- **MongoDB**: Database for storing user and work log data.
- **Mongoose**: ODM for MongoDB.

### Hosting
- **Frontend**: Hosted on GitHub Pages.
- **Backend**: Runs locally or deployable on Render/Heroku.

---

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ehsanmohajer/Internship-Tracker.git
   cd Internship-Tracker
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Add a `.env` file with the following content:
   ```plaintext
   MONGO_URI=<your_mongodb_connection_string>
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Open `index.html` in a browser (use Live Server or a local HTTP server for the best experience).

---

## API Endpoints

### User Routes (`/api/users`)
- **POST /register**: Register a new user.
- **POST /login**: Authenticate an existing user.

### Log Routes (`/api/logs`)
- **POST /:username/logs**: Add a work log for a user.
- **GET /:username/logs**: Retrieve all work logs for a user.

---

## How It Works
1. **Users**:
   - Register and login through the frontend.
   - Log daily work hours and tasks.
   - Monitor remaining hours via the dashboard.

2. **Managers**:
   - View all users and their logs.
   - Remove users if necessary.

---

## Notes
- Ensure the backend server is running before using the frontend.
- MongoDB connection requires a valid `MONGO_URI` in the `.env` file.
- Use `Live Server` or a similar tool to serve `index.html` for full functionality.

---

Feel free to contribute or raise issues on GitHub if you encounter any problems!
