const express = require("express")
const Question = require("../models/Question")
const auth = require("../middleware/auth")

const router = express.Router()

// Add logging middleware for this router
router.use((req, res, next) => {
  console.log(`Questions API: ${req.method} ${req.originalUrl}`)
  next()
})

// Test route to verify the router is working
router.get("/test", (req, res) => {
  res.json({ message: "Questions router is working!" })
})



// Get questions by domain
// Helper function
function normalizeDomain(domain) {
  return domain
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

router.get("/random/:domain", async (req, res) => {
  try {
    const rawDomain = req.params.domain
    const formattedDomain = normalizeDomain(rawDomain.replace(/-/g, " "))

    console.log(`Fetching random questions for domain: "${formattedDomain}"`)

    const { count = 10, difficulty } = req.query
    const query = { domain: formattedDomain }

    if (difficulty && difficulty !== "Mixed") {
      query.difficulty = difficulty
    }

    const totalQuestions = await Question.countDocuments(query)
    console.log(`Total available: ${totalQuestions}`)

    if (totalQuestions === 0) {
      const availableDomains = await Question.distinct("domain")
      return res.status(404).json({
        message: `No questions found for domain: "${formattedDomain}"`,
        availableDomains,
        requestedDomain: rawDomain,
      })
    }

    const requestedCount = Math.min(Number(count), totalQuestions)
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: requestedCount } }
    ])

    const sanitized = questions.map(q => ({
      ...q,
      options: q.options.map(opt => ({ text: opt.text }))
    }))

    res.json(sanitized)
  } catch (err) {
    console.error("Error fetching random questions:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})


// Get random questions for test
router.get("/random/:domain", async (req, res) => {
  try {
    const { domain } = req.params
    const { count = 10, difficulty } = req.query

    console.log(`Fetching ${count} random questions for domain: "${domain}"`)

    // Validate domain parameter
    if (!domain || domain.trim() === "") {
      return res.status(400).json({
        message: "Domain parameter is required",
      })
    }

    const query = { domain: domain.trim() }
    if (difficulty && difficulty !== "Mixed") {
      query.difficulty = difficulty
    }

    console.log("Query:", JSON.stringify(query))

    // First check if questions exist
    const totalQuestions = await Question.countDocuments(query)
    console.log(`Total questions available for "${domain}": ${totalQuestions}`)

    if (totalQuestions === 0) {
      // Get all available domains for debugging
      const availableDomains = await Question.distinct("domain")
      console.log("Available domains:", availableDomains)

      return res.status(404).json({
        message: `No questions found for domain: "${domain}"`,
        availableDomains: availableDomains,
        requestedDomain: domain,
      })
    }

    const requestedCount = Math.min(Number.parseInt(count), totalQuestions)
    console.log(`Requesting ${requestedCount} questions`)

    const questions = await Question.aggregate([{ $match: query }, { $sample: { size: requestedCount } }])

    console.log(`Found ${questions.length} questions`)

    // Remove correct answer indicators
    const questionsWithoutAnswers = questions.map((q) => ({
      ...q,
      options: q.options.map((opt) => ({ text: opt.text })),
    }))

    console.log(`Returning ${questionsWithoutAnswers.length} questions for "${domain}"`)

    res.json(questionsWithoutAnswers)
  } catch (error) {
    console.error("Error fetching random questions:", error)
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// Get all available domains
router.get("/domains", async (req, res) => {
  try {
    const domains = await Question.distinct("domain")
    const domainStats = []

    for (const domain of domains) {
      const count = await Question.countDocuments({ domain })
      domainStats.push({ domain, count })
    }

    res.json(domainStats)
  } catch (error) {
    console.error("Error fetching domains:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Submit answers and get results
router.post("/submit", auth, async (req, res) => {
  try {
    const { questionIds, answers, domain, timeTaken } = req.body

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: "Invalid question IDs" })
    }

    // Get questions with correct answers
    const questions = await Question.find({
      _id: { $in: questionIds },
    })

    if (questions.length === 0) {
      return res.status(404).json({ message: "Questions not found" })
    }

    let correctAnswers = 0
    const results = []

    questions.forEach((question, index) => {
      const userAnswer = answers[index]
      const correctOption = question.options.find((opt) => opt.isCorrect)
      const isCorrect = correctOption && correctOption.text === userAnswer

      if (isCorrect) correctAnswers++

      results.push({
        questionId: question._id,
        question: question.question,
        userAnswer,
        correctAnswer: correctOption ? correctOption.text : null,
        isCorrect,
        explanation: question.explanation,
      })
    })

    const score = Math.round((correctAnswers / questions.length) * 100)

    // Update user stats
    const User = require("../models/User")
    const user = await User.findById(req.userId)

    if (user) {
      user.stats.totalTests += 1
      user.stats.totalQuestions += questions.length
      user.stats.correctAnswers += correctAnswers
      user.stats.averageScore = Math.round(
        (user.stats.averageScore * (user.stats.totalTests - 1) + score) / user.stats.totalTests,
      )

      user.testHistory.push({
        domain,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        timeTaken,
      })

      await user.save()
    }

    res.json({
      score,
      correctAnswers,
      totalQuestions: questions.length,
      results,
      timeTaken,
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})


// Check answer (real-time validation)
router.post("/check-answer", async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body

    if (!questionId || !selectedAnswer) {
      return res.status(400).json({ message: "Question ID and selectedAnswer are required" })
    }

    // Get the question with correct option
    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ message: "Question not found" })
    }

    const correctOption = question.options.find(opt => opt.isCorrect)

    const isCorrect = correctOption && correctOption.text === selectedAnswer

    res.json({
      questionId,
      isCorrect,
      correctAnswer: correctOption ? correctOption.text : null,
    })
  } catch (err) {
    console.error("Error checking answer:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

module.exports = router
