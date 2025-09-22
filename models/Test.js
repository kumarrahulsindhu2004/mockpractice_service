const mongoose = require("mongoose")

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
      enum: ["General Knowledge", "Mathematics", "Aptitude", "Reasoning", "English"],
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    duration: {
      type: Number,
      required: true, // in minutes
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Mixed"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Test", testSchema)
