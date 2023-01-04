const Comment = require("../models/commentsModel");
const Note = require("../models/noteModel")
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');

const createComment = asyncHandler(async (req, res) => {
  const { content, noteId } = req.body;
  //console.log(req.body);

  if (!content || !noteId) {
    res.status(400);
    throw new Error("Please fill all the required fields");
    return;
}

  const note = await Note.findById(noteId);
  if (!note) {
    res.status(404);
    console.log(err.response);
    throw new Error("Note not found");
    return;
  }

  const comment = new Comment({ content, user: req.user._id, note: noteId, name: req.user.name });
  await comment.save();

  res.status(201).json(comment);
});

const getCommentsByNoteId = asyncHandler(async (req, res) => {
  const comments = await Comment.find({});//here, if i change this, it shows me all the comments, but not per id
  console.log(comments) 
  res.json(comments);
});

const updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const comment = await Comment.findById(req.params.id);

  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (comment) {
    comment.text = text;

    const updatedComment = await comment.save();
    res.json(updatedComment);
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (comment) {
    await comment.remove();
    res.json({ message: "Comment removed" });
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
});

module.exports = {
  getCommentsByNoteId,
  updateComment,
  deleteComment,
  createComment,
};
