const express = require("express");
const notes = require("./data/notes");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const ratingRoutes = require('./routes/ratingRoutes');


const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Set up the routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/comments", commentRoutes);
app.use('/api/rating', ratingRoutes);


//app.get("/api/notes", cors(), (req, res) => {
//res.json(notes);
//});

app.use(notFound);
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
