const express = require("express");
const router = express.Router();
const { 
  registerForExam, 
  getExamQuestions, 
  submitExam, 
  getSubmissions, 
  getSubmissionById, 
  deleteSubmission 
} = require("../controllers/examController");

// IMPORTANT: Adjust this import if your auth middleware is exported differently!
// If your authMiddleware uses `module.exports = { protect }`, keep it as is.
// If it uses `module.exports = protect`, change it to: const protect = require("../middlewares/authMiddleware");
const { protect } = require("../middlewares/authMiddleware");

// ==========================
// Public Student Routes
// ==========================
router.post("/register", registerForExam);
router.get("/questions/:categoryId", getExamQuestions);
router.post("/submit", submitExam);

// ==========================
// Private Admin Routes
// ==========================
router.get("/submissions", protect, getSubmissions);
router.get("/submissions/:id", protect, getSubmissionById);
router.delete("/submissions/:id", protect, deleteSubmission);

module.exports = router;