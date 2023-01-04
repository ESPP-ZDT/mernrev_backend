const express = require("express");
const {rateNote, likeNote,getUserNotes, createNote, getNoteById, updateNote, deleteNote, getNotes } = require("../controllers/notesControllers");
const {protect} = require('../middlewares/authMiddleware')


const router = express.Router();

router.route("/").get(getNotes);//usernotes??
router.route("/usernotes").get(protect,getUserNotes);//usernotes??
router.route("/create").post(protect, createNote);
router.route("/:id").get(protect,getNoteById).put(protect, updateNote).delete(protect,deleteNote);
router.put("/:id/like", protect, likeNote);
router.put("/:id/rating", protect, rateNote);




module.exports = router;
