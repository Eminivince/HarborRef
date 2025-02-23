// backend/server.js
require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cookieSession = require("cookie-session"); // alternative to express-session
const cors = require("cors");
const mongoose = require("mongoose");
// const connectDB = require("./config/db");
const localAuthRoutes = require("./routes/authLocal");
const googleAuthRoutes = require("./routes/authGoogle");
const logoutRoutes = require('./routes/logout');
// const xAuthRoutes = require("./routes/authX"); // import X auth routes
const userRoutes = require("./routes/user"); // import the user router
const referralCodeRoutes = require("./routes/referralCode"); // import the user router
const claimsRoutes = require("./routes/claims"); // import the claims router
require("./config/passport"); // so the passport strategies get loaded
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5002;

async function connectDB() {
  // process.env.MONGO_URI is your existing connection string
  // The "dbName" option here tells Mongoose which database to use
  return mongoose.connect(process.env.MONGODB_URI, {
    dbName: "HarborRef",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

connectDB()
  .then(() => console.log("✅ Connected to new DB"))
  .catch((err) => console.error("❌ Could not connect to DB:", err));

// Middleware
app.use(rateLimiter);
const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://harbor-r.vercel.app'
  : 'http://localhost:5174';

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600,
  })
);
app.use(express.json());

// SESSION setup (choose one of these)
// app.use(
//   cookieSession({
//     name: "mySession",
//     keys: [process.env.SESSION_SECRET],
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//   })
// );

// OR if you want to use express-session (with a store):
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Routes
app.use("/api/auth", localAuthRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/auth", logoutRoutes); // Add logout routes
// app.use("/api/auth", xAuthRoutes); // mount X auth routes
app.use("/api/user", userRoutes);
app.use("/api/user", referralCodeRoutes);
app.use("/api/claims", claimsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Backend");
});

// Protected route example
app.get("/api/protected", (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }
  res.json({ message: "This is protected data", user: req.user });
});

// Error handling middleware should be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
