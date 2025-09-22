const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      enum: ["General Knowledge", "Mathematics", "Aptitude", "Reasoning", "English"],
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],
    explanation: String,
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Question", questionSchema)
