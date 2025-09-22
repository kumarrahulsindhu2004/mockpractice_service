const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Import routes
const authRoutes = require("./routes/auth")
const questionRoutes = require("./routes/questions")
const testRoutes = require("./routes/tests")
const leaderboardRoutes = require("./routes/leaderboard")

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000","https://extraordinary-faun-6026a4.netlify.app/","https://mockpractice-service.onrender.com"],
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.static(path.join(__dirname, "client/dist")))

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Database connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mockpractice"
console.log("Connecting to MongoDB:", mongoUri)

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", (error) => {
  console.error("MongoDB connection error:", error)
})
db.once("open", () => {
  console.log("✅ Connected to MongoDB successfully")
})

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!", timestamp: new Date().toISOString() })
})

// Add route debugging
app.use("/api", (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`)
  next()
})

// Health check endpoint (move this BEFORE the routes)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/questions", questionRoutes)
app.use("/api/tests", testRoutes)
app.use("/api/leaderboard", leaderboardRoutes)

// Add a catch-all for API routes to help debug
app.use("/api/*", (req, res) => {
  console.log(`Unmatched API route: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    message: "API endpoint not found",
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      "GET /api/test",
      "GET /api/health",
      "GET /api/questions/test",
      "GET /api/questions/random/:domain",
      "POST /api/auth/login",
      "POST /api/auth/register",
    ],
  })
})

// Serve React app for non-API routes
app.get("*", (req, res) => {
  if (req.url.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found" })
  }
  res.sendFile(path.join(__dirname, "client/dist/index.html"))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend should be accessible at http://localhost:5173`)
  console.log(`🔧 Backend API accessible at http://localhost:${PORT}/api`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("Unhandled Promise Rejection:", err.message)
})
