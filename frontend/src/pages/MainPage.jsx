import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const MainPage = ({ searchQuery }) => {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showProjectPopup, setShowProjectPopup] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    files: [],
    teamSize: '',
  });
  const [joinCode, setJoinCode] = useState('');
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
  });
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched projects:', response.data);
        setProjects(response.data);
      } else {
        console.log('No token found, setting projects to empty array');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handlePlusClick = () => {
    setShowInitialModal(true);
  };

  const handleCreateProjectClick = () => {
    setShowInitialModal(false);
    setShowCreateModal(true);
  };

  const handleJoinProjectClick = () => {
    setShowInitialModal(false);
    setShowJoinModal(true);
  };

  const handleCreateProject = async () => {
    if (
      projectDetails.name.trim() &&
      projectDetails.description.trim() &&
      projectDetails.teamSize.trim() &&
      projectDetails.files.length > 0
    ) {
      const teamSize = parseInt(projectDetails.teamSize, 10);
      if (isNaN(teamSize) || teamSize <= 0) {
        setError('Please enter a valid team size (a positive number).');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a project.');
        return;
      }

      const formData = new FormData();
      formData.append('name', projectDetails.name);
      formData.append('description', projectDetails.description);
      formData.append('teamSize', teamSize);
      projectDetails.files.forEach((file) => formData.append('files', file));

      try {
        const response = await axios.post('http://localhost:5000/api/projects', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects([...projects, response.data.project]);
        setProjectDetails({ name: '', description: '', files: [], teamSize: '' });
        setShowCreateModal(false);
        setError('');
      } catch (error) {
        console.error('Error creating project:', error);
        const errorMessage = error.response?.data?.message || 'Failed to create project. Please try again.';
        setError(errorMessage);
      }
    } else {
      setError('Please fill in all fields and upload at least one file.');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setProjectDetails({ ...projectDetails, files });
  };

  const handleProjectClick = (projectId) => {
    setShowProjectPopup(projectId);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projects.filter((p) => p._id !== projectId));
        setShowProjectPopup(null);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project.');
      }
    }
  };

  const handleDownload = (project) => {
    const zipContent = project.files.map((file) => `File: ${file.name}, Size: ${file.size}, Type: ${file.type}\n`).join('');
    const blob = new Blob([zipContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}_project.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (joinCode.trim()) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }
        console.log('Sending join request with joinCode:', joinCode);
        const response = await axios.post(
          'http://localhost:5000/api/projects/join',
          { joinCode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Join response:', response.data);
        await fetchProjects();
        setJoinCode('');
        setShowJoinModal(false);
      } catch (error) {
        console.error('Join error:', error.response ? error.response.data : error.message);
        const errorMessage = error.response?.data?.message || 'Failed to join project. Please check the join code and try again.';
        alert(errorMessage);
      }
    } else {
      alert('Please enter a valid join code or URL.');
    }
  };

  const handleAddTask = async (projectId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add tasks.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/tasks`,
        taskDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedProject = projects.map((p) =>
        p._id === projectId ? { ...p, tasks: [...(p.tasks || []), response.data.task] } : p
      );
      setProjects(updatedProject);
      setTaskDetails({ title: '', description: '', assignedTo: '', dueDate: '' });
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error.response?.data?.message || 'Failed to add task.');
    }
  };

  const filteredProjects = searchQuery
    ? projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.joinCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  return (
    <div className="main-page">
      <div className="dashboard-content">
        {filteredProjects.length === 0 ? (
          <p className="no-projects-text">No projects yet. Add a project to get started.</p>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="project-container"
                onClick={() => handleProjectClick(project._id)}
              >
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p>Team Size: {project.teamSize} members (Current: {project.members.length})</p>
                <p>Join Code: {project.joinCode}</p>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project._id);
                  }}
                  style={{ marginTop: '10px' }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Button
        variant="contained"
        className="plus-button"
        onClick={handlePlusClick}
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
      >
        <AddIcon />
      </Button>

      {showInitialModal && (
        <div className="modal" onClick={() => setShowInitialModal(false)}>
          <div className="modal-content initial-modal" onClick={(e) => e.stopPropagation()}>
            <h2>What would you like to do?</h2>
            <div className="modal-actions">
              <Button variant="contained" color="primary" onClick={handleCreateProjectClick}>
                Create Project
              </Button>
              <Button variant="contained" color="success" onClick={handleJoinProjectClick}>
                Join Project
              </Button>
              <Button variant="outlined" onClick={() => setShowInitialModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content create-project-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create a New Project</h2>
            {error && <p style={{ color: 'red', fontSize: '0.9rem', margin: '4px 0' }}>{error}</p>}
            <div className="project-form">
              <input
                type="text"
                placeholder="Project Name"
                value={projectDetails.name}
                onChange={(e) => setProjectDetails({ ...projectDetails, name: e.target.value })}
                className="project-input"
              />
              <textarea
                placeholder="Short Description"
                value={projectDetails.description}
                onChange={(e) => setProjectDetails({ ...projectDetails, description: e.target.value })}
                className="project-input"
              />
              <input
                type="number"
                placeholder="Team Size"
                value={projectDetails.teamSize}
                onChange={(e) => setProjectDetails({ ...projectDetails, teamSize: e.target.value })}
                className="project-input"
                min="1"
              />
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="project-input"
              />
            </div>
            <div className="modal-actions">
              <Button variant="contained" color="primary" onClick={handleCreateProject}>
                Create Project
              </Button>
              <Button variant="outlined" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="modal" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content join-project-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Join a Project</h2>
            <form onSubmit={handleJoinSubmit} className="project-form">
              <input
                type="text"
                placeholder="Enter Join Code or URL"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="project-input"
              />
              <div className="modal-actions">
                <Button variant="contained" color="success" type="submit">
                  Join Project
                </Button>
                <Button variant="outlined" onClick={() => setShowJoinModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectPopup && (
        <div className="modal" onClick={() => setShowProjectPopup(null)}>
          <div className="modal-content project-popup" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const project = projects.find((p) => p._id === showProjectPopup);
              if (!project) {
                return <p>Project not found.</p>;
              }

              const userId = localStorage.getItem('userId');
              const isAdmin = userId && project.adminId && project.adminId.toString() === userId;

              return (
                <>
                  <h2>{project.name}</h2>
                  <p>{project.description}</p>
                  <p>
                    Team Size: {project.teamSize} members (Current: {project.members.length})
                  </p>
                  <p>Join Code: {project.joinCode}</p>
                  <h3>Team Members:</h3>
                  <ul>
                    {project.members && project.members.length > 0 ? (
                      project.members.map((member, index) => (
                        <li key={index}>
                          {typeof member === 'object' && member.username
                            ? member.username
                            : `User ${member}`}
                          {project.adminId && member._id && project.adminId.toString() === member._id.toString() && ' (Admin)'}
                        </li>
                      ))
                    ) : (
                      <li>No members found.</li>
                    )}
                  </ul>
                  <h3>Files/Folders:</h3>
                  <ul>
                    {project.files && project.files.length > 0 ? (
                      project.files.map((file, index) => (
                        <li key={index}>
                          {file.name} ({file.type}, {file.size} bytes)
                        </li>
                      ))
                    ) : (
                      <li>No files found.</li>
                    )}
                  </ul>
                  {isAdmin && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setShowTaskModal(true)}
                      style={{ marginTop: '10px' }}
                    >
                      Add Task
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownload(project)}
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                  >
                    Download Project
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteProject(project._id)}
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowProjectPopup(null)}
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                  >
                    Close
                  </Button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showTaskModal && showProjectPopup && (
        <div className="modal" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content create-project-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Task</h2>
            {error && <p style={{ color: 'red', fontSize: '0.9rem', margin: '4px 0' }}>{error}</p>}
            <div className="project-form">
              <input
                type="text"
                placeholder="Task Title"
                value={taskDetails.title}
                onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
                className="project-input"
              />
              <textarea
                placeholder="Task Description"
                value={taskDetails.description}
                onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
                className="project-input"
              />
              <input
                type="text"
                placeholder="Assigned To (User ID)"
                value={taskDetails.assignedTo}
                onChange={(e) => setTaskDetails({ ...taskDetails, assignedTo: e.target.value })}
                className="project-input"
              />
              <input
                type="date"
                value={taskDetails.dueDate}
                onChange={(e) => setTaskDetails({ ...taskDetails, dueDate: e.target.value })}
                className="project-input"
              />
            </div>
            <div className="modal-actions">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddTask(projects.find((p) => p._id === showProjectPopup)._id)}
              >
                Add Task
              </Button>
              <Button variant="outlined" onClick={() => setShowTaskModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;