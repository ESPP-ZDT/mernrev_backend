const mongoose = require("mongoose");


const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  note: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Note",
  },
  name:{
    type: String,
    required:false
  }

});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
