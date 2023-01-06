const mongoose = require("mongoose");

// Load the Rating and Note models
const Rating = require("../models/ratingsModel");
const Note = require("../models/noteModel");

const asyncHandler = require("express-async-handler");

const rateNote = asyncHandler(async (req, res) => {
    try {
      // Find the note being rated
      const note = await Note.findById(req.params.id);
      if (!note) return res.status(404).send("Note not found");
  
      // Find the user's rating in the ratings collection
      const rating = await Rating.findOne({
        note: req.params.id,
        user: req.body.userId,
      });
  
      // If the user has already rated the note, update their rating
      if (rating) {
        rating.rating = req.body.rating;
        await rating.save();
      } else {
        // If the user has not yet rated the note, create a new rating document
        const newRating = new Rating({
            note: note._id,
            user: req.body.userId,
            rating: req.body.rating,
          });
          
        await newRating.save();
      }
  
      // Calculate the mean rating for the note using an aggregation pipeline
      const pipeline = [
        {
          $match: {
            note: {
              $eq: note._id
            },
          },
        },
        {
          $group: {
            _id: "$note",
            meanRating: { $avg: "$rating" },
          },
        },
        {
          $project: {
            _id: 1,
            meanRating: 1,
          },
        },
      ];
      
      const result = await Rating.aggregate(pipeline);
      const meanRating = result[0].meanRating;
  
      // Update the meanRating field of the note
      note.meanRating = meanRating;
      await note.save();
  
      res.send({ meanRating: note.meanRating });
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
  
  

module.exports = { rateNote };
