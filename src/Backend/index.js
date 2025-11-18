// 1. Import libraries
const express = require('express');
const cors = require('cors');

// 2. Create the Express app
const app = express();

// 3. Middleware (things that run before your routes)

// This lets Express read JSON bodies like { "title": "hi" }
app.use(express.json());

// This allows your frontend (running on a different port) to call this backend
app.use(cors());

// 4. In-memory "database" (just a JS array for now)
let projects = [
  {
    id: 'demo-1',
    title: 'Aggie Matchmaker',
    description: 'Prototype matching students to labs at UC Davis.',
    status: 'brainstorming',
  },
];

// 5. Health check route: GET /
app.get('/', (req, res) => {
  res.send('HerdSourcing backend is running');
});

// 6. Get all projects: GET /api/projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// 7. Create a new project: POST /api/projects
app.post('/api/projects', (req, res) => {
  // Pull data from the JSON body
  const { title, description, status } = req.body;

  // Basic validation
  if (!title || !description || !status) {
    return res
      .status(400)
      .json({ error: 'title, description, and status are required' });
  }

  // Make a unique-ish id using timestamp
  const id = 'proj-' + Date.now();

  const newProject = {
    id,
    title,
    description,
    status,
  };

  // Save it in our "database"
  projects.push(newProject);

  // Return the created project with 201 (Created)
  res.status(201).json(newProject);
});

// 8. Update a project: PUT /api/projects/:id
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  // Find the project in the array
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Only update fields that are provided
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (status !== undefined) project.status = status;

  res.json(project);
});

// 9. Delete a project: DELETE /api/projects/:id
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Remove that project from the array
  const deleted = projects.splice(index, 1)[0];

  res.json({ message: 'Project deleted', project: deleted });
});

// 10. Start the server
const PORT = 4000; // or whatever you want
app.listen(PORT, () => {
  console.log(`HerdSourcing backend listening on http://localhost:${PORT}`);
});