const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

app.use((req, res, next) => {
  const publicPaths = ['/api/auth/login', '/api/auth/signup', '/api/projects', '/api/projects/join'];
  if (publicPaths.includes(req.path)) {
    return next();
  }
  authenticateToken(req, res, next);
});

// Connect to MongoDB with Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected via Mongoose');
    const client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: '1', // Changed from 'v1' to '1'
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

app.use('/api', projectRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});