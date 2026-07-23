const mongoose = require("mongoose");

const examSubmissionSchema = new mongoose.Schema(
  {
    // Category Snapshot
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    // Student Information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    contactNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    schoolCollege: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    // Exam Summary
    totalQuestions: {
      type: Number,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    // Answer Snapshot
    answers: {
      type: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
          },

          question: {
            type: String,
            required: true,
            trim: true,
          },

          options: [
            {
              type: String,
            },
          ],

          selectedAnswer: {
            type: String,
            default: "",
          },

          correctAnswer: {
            type: String,
            required: true,
          },

          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExamSubmission", examSubmissionSchema);