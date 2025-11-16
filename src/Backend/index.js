// Import Express
const express = require('express');

// Create Express Server Object
const app = express();

// Parse JSON requests
app.use(express.json());

// Mutable Fake Database (for testing)
let projects = [{ id: "...", title: "...", status: "..." }];

app.get('/', (req, res) => {
  res.send('hello');
});

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