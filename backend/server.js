const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const path = require('path');
const { MongoClient } = require('mongodb'); // Add MongoDB driver

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected via Mongoose');

    // Optional: Add a ping test using MongoClient
    const client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
      console.error('Ping test failed:', err);
    } finally {
      await client.close();
    }
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', projectRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});