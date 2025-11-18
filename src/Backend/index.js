// Import Express and Cors
const express = require('express');
const cors = require('cors');

// Create Express Server Object
const app = express();

// Parse JSON requests
app.use(express.json());
app.use(cors());

// Mutable Database (for testing)
let projects = [
  {
    id: 'demo-1',
    title: 'Aggie Matchmaker',
    description: 'Prototype matching students to labs at UC Davis.',
    status: 'brainstorming',
  },
];

// Set up simple GET / routes
app.get('/', (req, res) => {
  res.send('Heardsourcing backend is running');
});

// GET /api/projects route
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// POST /api/projects route
app.get('/api/projects', (req, res) => {
  // The request loooks for title, description, status
  const { title, description, status } = req.body;

  // If not proper input return response error
  if (!title || !description || !status) {
    return res.status(400).json({ error: 'title, description, and status are required' });
  }

  // Unique ID
  const id = 'proj-' + Date.now();

  const newProject = {
    id,
    title,
    description,
    status,
  }
  
  // Add project to database
  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update projects with PATCH /api/projects/:id
app.patch('/api/projects/:id', (req, res) => {

  // Extract the id and body fields
  const{ id } = req.params;
  const { title, description, status } = req.body;

  // Find project in array
  const project = projects.find((p) => p.id === id);

  // Return error if not found
  if (!project) {
    return res.status(404).json({ error: 'Project not found '});
  }
  
  // Update provided fields
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (status !== undefined) project.status = status;

  // Response
  res.json(project);
  
});

app.delete('/api/projects/:id', (req, res) => {

  const { id } = req.params;

  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const deleted = projects.splice(index, 1)[0];

  res.json(deleted);
});

const PORT = 5000;

// Start + Test Server Running
app.listen(PORT, () => {
  console.log("Server running");
});


app.post("/api/projects", (req, res) => {
  
  const { title, description, status } = req.body;

  // Create unique id
  const id = "proj-" + Date.now();

  // New Project
  const newProject = {
    id,
    title,
    description,
    status,
  };

  projects.push(newProject);

  res.status(201).json(newProject);

});