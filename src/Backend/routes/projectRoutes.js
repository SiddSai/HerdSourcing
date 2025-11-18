const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');

// GET all projects
router.get('/', controller.getAllProjects);

// POST create project
router.post('/', controller.createProject);

// PUT update project
router.put('/:id', controller.updateProject);

// DELETE project
router.delete('/:id', controller.deleteProject);

module.exports = router;