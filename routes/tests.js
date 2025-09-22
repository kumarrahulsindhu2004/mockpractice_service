const express = require("express")
const Test = require("../models/Test")
const Question = require("../models/Question")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all tests
router.get("/", async (req, res) => {
  try {
    const { domain } = req.query
    const query = domain ? { domain, isActive: true } : { isActive: true }

    const tests = await Test.find(query).populate("createdBy", "username").sort({ createdAt: -1 })

    res.json(tests)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get test by ID
router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate("questions").populate("createdBy", "username")

    if (!test) {
      return res.status(404).json({ message: "Test not found" })
    }

    res.json(test)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create new test
router.post("/", auth, async (req, res) => {
  try {
    const { title, domain, questionCount, difficulty, duration } = req.body

    // Get random questions based on criteria
    const query = { domain }
    if (difficulty !== "Mixed") {
      query.difficulty = difficulty
    }

    const questions = await Question.aggregate([{ $match: query }, { $sample: { size: questionCount } }])

    const test = new Test({
      title,
      domain,
      questions: questions.map((q) => q._id),
      difficulty,
      duration,
      createdBy: req.userId,
    })

    await test.save()
    res.status(201).json(test)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
