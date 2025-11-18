const express = require('express');
const cors = require('cors');

const projectRoutes = require('./routes/projectRoutes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/projects', projectRoutes);

module.exports = app;