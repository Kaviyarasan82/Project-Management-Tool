import React, { useState } from 'react';
import './MainPage.css';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const MainPage = () => {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false); // State for join project modal
  const [showProjectPopup, setShowProjectPopup] = useState(null); // For project popup
  const [projects, setProjects] = useState([]); // Store created projects
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    files: [],
    teamSize: '', // Team size from previous update
  });
  const [joinCode, setJoinCode] = useState(''); // State for join code/URL

  const handlePlusClick = () => {
    setShowInitialModal(true);
  };

  const handleCreateProjectClick = () => {
    setShowInitialModal(false);
    setShowCreateModal(true);
  };

  const handleJoinProjectClick = () => {
    setShowInitialModal(false);
    setShowJoinModal(true); // Open the join project modal
  };

  const handleCreateProject = () => {
    if (projectDetails.name.trim() && projectDetails.description.trim() && projectDetails.files.length > 0 && projectDetails.teamSize.trim()) {
      // Ensure teamSize is a valid number
      const teamSize = parseInt(projectDetails.teamSize, 10);
      if (isNaN(teamSize) || teamSize <= 0) {
        alert('Please enter a valid team size (a positive number).');
        return;
      }

      setProjects([
        ...projects,
        {
          id: Date.now(), // Unique ID for each project
          name: projectDetails.name,
          description: projectDetails.description,
          files: projectDetails.files,
          teamSize: teamSize, // Store team size as a number
        },
      ]);
      setProjectDetails({ name: '', description: '', files: [], teamSize: '' }); // Reset form
      setShowCreateModal(false); // Close modal
    } else {
      alert('Please fill in all fields and upload at least one file.');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setProjectDetails({
      ...projectDetails,
      files: files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    });
  };

  const handleProjectClick = (projectId) => {
    setShowProjectPopup(projectId);
  };

  const handleDownload = (project) => {
    // Simulate downloading files (in a real app, this would involve backend integration)
    const zipContent = project.files.map(file => `File: ${file.name}, Size: ${file.size}, Type: ${file.type}\n`).join('');
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

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (joinCode.trim()) {
      // Here you would typically send the joinCode to a backend to validate and join the project
      alert(`Joining project with code/URL: ${joinCode}`);
      setJoinCode(''); // Reset join code
      setShowJoinModal(false); // Close the modal
    } else {
      alert('Please enter a valid join code or URL.');
    }
  };

  return (
    <div className="main-page">
      <div className="dashboard-content">
        <h1>Your Dashboard</h1>
        <p className="subtitle">Manage your projects efficiently!</p>
        
        {/* Show project containers only if there are projects, without default text */}
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map(project => (
              <div
                key={project.id}
                className="project-container"
                onClick={() => handleProjectClick(project.id)}
              >
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p>Team Size: {project.teamSize} members</p> {/* Display team size in project card */}
              </div>
            ))}
          </div>
        ) : (
          // Show default text only if there are no projects
          <>
            <p className="no-projects-text">No projects yet. Add a project to get started.</p>
            <p className="account-tip">Don’t see your projects? Try another account</p>
          </>
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

      {/* Initial Modal (What would you like to do?) */}
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

      {/* Create Project Modal (Form) */}
      {showCreateModal && (
        <div className="modal" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content create-project-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create a New Project</h2>
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
                min="1" // Ensure only positive numbers
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

      {/* Join Project Modal (New) */}
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

      {/* Project Details Popup */}
      {showProjectPopup && (
        <div className="modal" onClick={() => setShowProjectPopup(null)}>
          <div className="modal-content project-popup" onClick={(e) => e.stopPropagation()}>
            {projects.find(p => p.id === showProjectPopup) && (
              <>
                <h2>{projects.find(p => p.id === showProjectPopup).name}</h2>
                <p>{projects.find(p => p.id === showProjectPopup).description}</p>
                <p>Team Size: {projects.find(p => p.id === showProjectPopup).teamSize} members</p> {/* Display team size in popup */}
                <h3>Files/Folders:</h3>
                <ul>
                  {projects.find(p => p.id === showProjectPopup).files.map((file, index) => (
                    <li key={index}>
                      {file.name} ({file.type}, {file.size} bytes)
                    </li>
                  ))}
                </ul>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownload(projects.find(p => p.id === showProjectPopup))}
                >
                  Download Project
                </Button>
                <Button variant="outlined" onClick={() => setShowProjectPopup(null)}>
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;