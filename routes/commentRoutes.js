const express = require("express");
const { createComment, getCommentsByNoteId, updateComment, deleteComment } = require("../controllers/commentsControllers");
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/create").post(protect, createComment);

// Get all comments for a specific note
router.route("/:noteId").get( getCommentsByNoteId);

// Update a specific comment
router.route("/:id").put(protect, updateComment).delete(protect, deleteComment);

module.exports = router;
