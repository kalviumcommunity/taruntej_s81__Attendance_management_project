// server.js - StudyShelf Backend with MongoDB

// Import necessary modules
const express = require('express'); // Web framework for Node.js
const mongoose = require('mongoose'); // MongoDB object modeling tool
const cors = require('cors'); // Middleware for enabling Cross-Origin Resource Sharing
const dotenv = require('dotenv'); // For loading environment variables from a .env file

// Load environment variables from .env file (if you create one)
// Example .env content:
// MONGODB_URI="mongodb+srv://taruntej947:qXwyBVdljaYy4Kmq@cluster0.hcdp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
dotenv.config();

const app = express(); // Initialize Express application
const port = process.env.PORT || 5000; // Port to run the server on

// Middleware setup
app.use(cors()); // Enable CORS for all routes, allowing your frontend to access it
app.use(express.json()); // Enable parsing of JSON request bodies

// MongoDB Connection URI
// IMPORTANT: Replace this with your actual MongoDB Atlas connection string.
// It's best practice to store this in an environment variable (e.g., .env file).
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://taruntej947:qXwyBVdljaYy4Kmq@cluster0.hcdp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose Schema for Books
// This defines the structure of a 'book' document in your MongoDB collection
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now } // Automatically set creation timestamp
});

// Create a Mongoose Model from the schema
// This 'Book' model will be used to interact with the 'books' collection in MongoDB
const Book = mongoose.model('Book', bookSchema);

// Define a Mongoose Schema for Reviews
const reviewSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the Book model
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// --- API Routes ---

// Route to get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all documents from the 'books' collection
    res.json(books); // Send the books as a JSON response
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Server error fetching books' });
  }
});

// Route to add a new book (Admin functionality)
app.post('/api/books', async (req, res) => {
  // In a real application, you would add authentication and authorization here
  // to ensure only admins can add books.
  const { title, author, category, description, imageUrl } = req.body;

  if (!title || !author || !category || !description) {
    return res.status(400).json({ message: 'Please provide all required book fields.' });
  }

  try {
    const newBook = new Book({
      title,
      author,
      category,
      description,
      imageUrl,
      averageRating: 0,
      reviewCount: 0,
    });
    await newBook.save(); // Save the new book to MongoDB
    res.status(201).json(newBook); // Respond with the created book
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ message: 'Server error adding book' });
  }
});

// Route to delete a book (Admin functionality)
app.delete('/api/books/:id', async (req, res) => {
  // Again, authentication and authorization would be crucial here.
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    // Also delete associated reviews
    await Review.deleteMany({ bookId: req.params.id });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Server error deleting book' });
  }
});

// Route to get reviews for a specific book
app.get('/api/books/:bookId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// Route to add a review for a book
app.post('/api/books/:bookId/reviews', async (req, res) => {
  // In a real app, ensure user is authenticated before allowing review submission.
  const { userId, userName, rating, reviewText } = req.body;
  const { bookId } = req.params;

  if (!userId || !userName || !rating || !reviewText) {
    return res.status(400).json({ message: 'Please provide all required review fields.' });
  }

  try {
    const newReview = new Review({
      bookId,
      userId,
      userName,
      rating,
      reviewText,
    });
    await newReview.save();

    // Update the book's average rating and review count
    const book = await Book.findById(bookId);
    if (book) {
      const currentReviews = book.reviewCount || 0;
      const currentTotalRating = (book.averageRating || 0) * currentReviews;

      const newReviewCount = currentReviews + 1;
      const newTotalRating = currentTotalRating + rating;
      const newAverageRating = newTotalRating / newReviewCount;

      book.averageRating = newAverageRating;
      book.reviewCount = newReviewCount;
      await book.save();
    }

    res.status(201).json(newReview);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Server error adding review' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`StudyShelf backend server running on port ${port}`);
});
