const mongoose = require("mongoose")
const Question = require("../models/Question")

const testDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mockpractice"
    await mongoose.connect(mongoUri)
    console.log("✅ Connected to MongoDB")

    // Test basic query
    const totalQuestions = await Question.countDocuments()
    console.log(`📊 Total questions in database: ${totalQuestions}`)

    // Test domain queries
    const domains = await Question.distinct("domain")
    console.log(`📚 Available domains: ${domains.join(", ")}`)

    for (const domain of domains) {
      const count = await Question.countDocuments({ domain })
      console.log(`  - ${domain}: ${count} questions`)
    }

    // Test specific domain query (Mathematics)
    console.log("\n🔍 Testing Mathematics domain:")
    const mathQuestions = await Question.find({ domain: "Mathematics" }).limit(3)
    mathQuestions.forEach((q, index) => {
      console.log(`  ${index + 1}. ${q.question}`)
      console.log(`     Options: ${q.options.map((opt) => opt.text).join(", ")}`)
    })

    // Test aggregation query
    console.log("\n🎲 Testing random question aggregation:")
    const randomQuestions = await Question.aggregate([{ $match: { domain: "Mathematics" } }, { $sample: { size: 2 } }])
    console.log(`Found ${randomQuestions.length} random questions`)

    console.log("\n✅ Database test completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Database test failed:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  testDatabase()
}

module.exports = { testDatabase }
