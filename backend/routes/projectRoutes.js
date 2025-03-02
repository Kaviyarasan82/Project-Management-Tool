const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in an uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
  },
});
const upload = multer({ storage });

// Helper to generate a unique join code
const generateJoinCode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase(); // 8-character random code
};

// Create a new project
router.post('/projects', upload.array('files'), async (req, res) => {
  try {
    const { name, description, teamSize } = req.body;
    const files = req.files.map(file => ({
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
    }));

    // Generate a unique join code
    let joinCode;
    let isUnique = false;
    while (!isUnique) {
      joinCode = generateJoinCode();
      const existingProject = await Project.findOne({ joinCode });
      if (!existingProject) isUnique = true;
    }

    const project = new Project({
      name,
      description,
      teamSize: parseInt(teamSize),
      files,
      joinCode,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Fetch all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// Join a project by join code
router.post('/projects/join', async (req, res) => {
  try {
    const { joinCode } = req.body;
    const project = await Project.findOne({ joinCode });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error joining project:', error);
    res.status(500).json({ message: 'Error joining project', error });
  }
});

module.exports = router;