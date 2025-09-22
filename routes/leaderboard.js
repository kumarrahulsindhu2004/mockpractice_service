const express = require("express")
const User = require("../models/User")

const router = express.Router()

// Get global leaderboard
router.get("/", async (req, res) => {
  try {
    const { domain, limit = 50 } = req.query

    let users
    if (domain) {
      // Get leaderboard for specific domain
      users = await User.aggregate([
        { $unwind: "$testHistory" },
        { $match: { "testHistory.domain": domain } },
        {
          $group: {
            _id: "$_id",
            username: { $first: "$username" },
            profile: { $first: "$profile" },
            totalTests: { $sum: 1 },
            averageScore: { $avg: "$testHistory.score" },
            totalQuestions: { $sum: "$testHistory.totalQuestions" },
            correctAnswers: { $sum: "$testHistory.correctAnswers" },
          },
        },
        { $sort: { averageScore: -1, totalTests: -1 } },
        { $limit: Number.parseInt(limit) },
      ])
    } else {
      // Global leaderboard
      users = await User.find({})
        .select("username profile stats")
        .sort({ "stats.averageScore": -1, "stats.totalTests": -1 })
        .limit(Number.parseInt(limit))
    }

    // Add rank
    const leaderboard = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))

    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user rank
router.get("/rank/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { domain } = req.query

    let rank
    if (domain) {
      // Get rank for specific domain
      const users = await User.aggregate([
        { $unwind: "$testHistory" },
        { $match: { "testHistory.domain": domain } },
        {
          $group: {
            _id: "$_id",
            averageScore: { $avg: "$testHistory.score" },
            totalTests: { $sum: 1 },
          },
        },
        { $sort: { averageScore: -1, totalTests: -1 } },
      ])

      rank = users.findIndex((user) => user._id.toString() === userId) + 1
    } else {
      // Global rank
      const users = await User.find({}).select("_id stats").sort({ "stats.averageScore": -1, "stats.totalTests": -1 })

      rank = users.findIndex((user) => user._id.toString() === userId) + 1
    }

    res.json({ rank: rank || "Unranked" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
