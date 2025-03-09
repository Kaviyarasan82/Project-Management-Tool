const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    console.log('Authenticated user:', req.auth);
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Create a new project
router.post('/projects', authenticateToken, upload.array('files'), async (req, res) => {
  const { name, description, teamSize } = req.body;

  if (!name || !description || !teamSize) {
    return res.status(400).json({ message: 'Name, description, and team size are required' });
  }

  const teamSizeNum = parseInt(teamSize);
  if (isNaN(teamSizeNum) || teamSizeNum <= 0) {
    return res.status(400).json({ message: 'Team size must be a positive number' });
  }

  const files = req.files || [];
  if (files.length === 0) {
    return res.status(400).json({ message: 'At least one file is required' });
  }

  try {
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fileDetails = files.map((file) => ({
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      path: file.path,
    }));

    const project = new Project({
      name,
      description,
      teamSize: teamSizeNum,
      files: fileDetails,
      userId: req.auth.id,
      adminId: req.auth.id,
      members: [req.auth.id],
      joinCode,
      tasks: [],
    });

    await project.save();

    await User.findByIdAndUpdate(req.auth.id, {
      $push: { history: `Created project: ${name} at ${new Date().toISOString()}` },
    });

    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project. Please try again.', error: error.message });
  }
});

// Get user's projects
router.get('/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.auth.id }).populate('members', 'username');
    console.log(`Fetched projects for user ${req.auth.id}:`, projects);
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Join a project
router.post('/projects/join', authenticateToken, async (req, res) => {
  const { joinCode } = req.body;

  console.log('Join request received:', { joinCode, userId: req.auth.id });

  if (!joinCode) {
    console.log('Join code missing');
    return res.status(400).json({ message: 'Join code is required' });
  }

  try {
    const project = await Project.findOne({ joinCode }).select('+members'); // Include members field
    if (!project) {
      console.log('Project not found with join code:', joinCode);
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('Found project:', project);

    // Check if the user is already a member
    const isMember = project.members.some((member) => member.toString() === req.auth.id);
    if (isMember) {
      console.log('User is already a member:', req.auth.id);
      return res.status(400).json({ message: 'You are already a member of this project' });
    }

    // Check if the team size limit has been reached
    if (project.members.length >= project.teamSize) {
      console.log('Team size limit reached:', { current: project.members.length, max: project.teamSize });
      return res.status(400).json({ message: 'Team size limit reached' });
    }

    // Update the project with the new member
    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      { $push: { members: req.auth.id } },
      { new: true, runValidators: true, populate: 'members' }
    );

    if (!updatedProject) {
      throw new Error('Failed to update project');
    }

    console.log('User added to project:', req.auth.id);

    // Update the user's history
    await User.findByIdAndUpdate(req.auth.id, {
      $push: { history: `Joined project: ${project.name} at ${new Date().toISOString()}` },
    });
    console.log('User history updated:', req.auth.id);

    console.log('Returning updated project:', updatedProject);
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error joining project:', error);
    res.status(500).json({ message: 'Failed to join project', error: error.message });
  }
});

// Add a task (only admin can add tasks)
router.post('/projects/:projectId/tasks', authenticateToken, async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  if (!title || !description || !assignedTo) {
    return res.status(400).json({ message: 'Title, description, and assignedTo are required' });
  }

  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.adminId.toString() !== req.auth.id) {
      return res.status(403).json({ message: 'Only the admin can add tasks' });
    }

    const task = {
      title,
      description,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    project.tasks.push(task);
    await project.save();

    res.status(201).json({ message: 'Task added', task });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Failed to add task' });
  }
});

// Delete a project
router.delete('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }

    await User.findByIdAndUpdate(req.auth.id, {
      $push: { history: `Deleted project: ${project.name} at ${new Date().toISOString()}` },
    });

    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

module.exports = router;