// backend/server.js
require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const localAuthRoutes = require("./routes/authLocal");
const googleAuthRoutes = require("./routes/authGoogle");
const userRoutes = require("./routes/user");
const referralCodeRoutes = require("./routes/referralCode");
const claimsRoutes = require("./routes/claims");
const logoutRoutes = require("./routes/logout");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");
const jwtAuth = require("./middleware/jwtAuth");
const verifyToken = require("./middleware/jwtAuth");

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
const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://harbor-r.vercel.app"
    : "http://localhost:5173";

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

// Set trust proxy
app.set("trust proxy", 1);

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", localAuthRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/auth", logoutRoutes); // Add logout routes
// app.use("/api/auth", xAuthRoutes); // mount X auth routes
app.use("/api/user", verifyToken, userRoutes);
app.use("/api/user", verifyToken, referralCodeRoutes);
app.use("/api/claims", verifyToken, claimsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Backend");
});

// Protected route example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});

// Error handling middleware should be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
