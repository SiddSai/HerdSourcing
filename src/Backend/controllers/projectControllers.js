const store = require('../data/projectStore');

// GET /api/projects
exports.getAllProjects = (req, res) => {
  res.json(store.projects);
};

// POST /api/projects
exports.createProject = (req, res) => {
  const { title, description, status } = req.body;

  if (!title || !description || !status) {
    return res.status(400).json({ error: "title, description, and status required" });
  }

  const newProj = {
    id: "proj-" + Date.now(),
    title,
    description,
    status,
  };

  store.projects.push(newProj);

  res.status(201).json(newProj);
};

// PUT /api/projects/:id
exports.updateProject = (req, res) => {
  const { id } = req.params;
  const project = store.projects.find((p) => p.id === id);

  if (!project) return res.status(404).json({ error: "Project not found" });

  const { title, description, status } = req.body;

  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (status !== undefined) project.status = status;

  res.json(project);
};

// DELETE /api/projects/:id
exports.deleteProject = (req, res) => {
  const index = store.projects.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  const removed = store.projects.splice(index, 1)[0];

  res.json({ message: "Deleted", project: removed });
};