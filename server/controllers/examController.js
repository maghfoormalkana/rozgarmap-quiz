const Question = require("../models/Question");
const Category = require("../models/Category");
const ExamSubmission = require("../models/ExamSubmission");

// @desc    Validate student registration details before exam
// @route   POST /api/exam/register
// @access  Public
exports.registerForExam = async (req, res, next) => {
  try {
    const { email, categoryId } = req.body;
    
    // Optional: Check if student already took this exact exam
    const existingSubmission = await ExamSubmission.findOne({ email, categoryId });
    if (existingSubmission) {
      return res.status(400).json({ message: "You have already submitted this exam." });
    }

    res.status(200).json({ message: "Registration validated. Proceed to instructions." });
  } catch (error) {
    next(error);
  }
};

// @desc    Get questions WITHOUT correct answers for the exam UI
// @route   GET /api/exam/questions/:categoryId
// @access  Public
exports.getExamQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ categoryId: req.params.categoryId })
      .select("-correctAnswer"); // Critical: Prevent answer leakage

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found for this exam." });
    }

    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit exam, calculate score, and save snapshot
// @route   POST /api/exam/submit
// @access  Public
exports.submitExam = async (req, res, next) => {
  try {
    const { categoryId, studentDetails, submittedAnswers } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const questions = await Question.find({ categoryId });
    
    let correctAnswersCount = 0;
    let wrongAnswersCount = 0;
    const answerSnapshots = [];

    // Backend comparison logic
    questions.forEach((q) => {
      const studentAttempt = submittedAnswers.find(
        (ans) => ans.questionId === q._id.toString()
      );
      
      const selectedAnswer = studentAttempt ? studentAttempt.selectedAnswer : null;
      const isCorrect = selectedAnswer === q.correctAnswer;

      if (selectedAnswer) {
        if (isCorrect) correctAnswersCount++;
        else wrongAnswersCount++;
      } else {
        wrongAnswersCount++; // Unanswered counts as wrong
      }

      answerSnapshots.push({
        questionId: q._id,
        question: q.question,
        options: q.options,
        selectedAnswer: selectedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      });
    });

    const totalQuestions = questions.length;
    const score = (correctAnswersCount / totalQuestions) * 100;

    // Save final submission
    await ExamSubmission.create({
      categoryId: category._id,
      categoryName: category.name,
      ...studentDetails,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      wrongAnswers: wrongAnswersCount,
      score,
      answers: answerSnapshots,
    });

    // Client only receives a success acknowledgment
    res.status(201).json({ 
      message: "Your exam has been submitted successfully. Thank you for participating. We wish you the very best." 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all exam submissions
// @route   GET /api/exam/submissions
// @access  Private/Admin
exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await ExamSubmission.find()
      .select("-answers") // Exclude heavy array for list view
      .sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exam submission with full snapshot
// @route   GET /api/exam/submissions/:id
// @access  Private/Admin
exports.getSubmissionById = async (req, res, next) => {
  try {
    const submission = await ExamSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete submission
// @route   DELETE /api/exam/submissions/:id
// @access  Private/Admin
exports.deleteSubmission = async (req, res, next) => {
  try {
    await ExamSubmission.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Submission deleted" });
  } catch (error) {
    next(error);
  }
};