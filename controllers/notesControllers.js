const Note = require("../models/noteModel");
const asyncHandler = require("express-async-handler");

const getUserNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    res.status(400);
    throw new Error("Please Fill all the feilds");
    return;
  } else {
    const note = new Note({ user: req.user._id, title, content, category });

    const createdNote = await note.save();

    res.status(201).json(createdNote);
  }
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (note) {
    note.title = title;
    note.content = content;
    note.category = category;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error("Note not found");
  }
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (note) {
    await note.remove();
    res.json({ message: "Note Removed" });
  } else {
    res.status(404);
    throw new Error("Note not Found");
  }
});

const likeNote = asyncHandler(async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).send("Note not found");

    const userId = req.body.userId;
    if (note.likes.includes(userId)) {
      // If the user has already liked the note, remove their ObjectId from the likes array
      note.likes = note.likes.filter((like) => like.toString() !== userId);
    } else {
      // If the user has not liked the note, add their ObjectId to the likes array
      note.likes.push(userId);
    }

    await note.save();
    res.send(note);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const rateNote = asyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const note = await Note.findById(noteId);
  if (!note) return res.status(404).send("Note not found");

  const rating = req.body.rating;
  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be a number between 1 and 5");
  }

  note.rating = rating;
  await note.save();
  res.send(note);
});

module.exports = {
  rateNote,
  likeNote,
  getUserNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  getNotes,
};
