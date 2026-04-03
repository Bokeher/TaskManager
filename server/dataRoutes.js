const express = require('express');
const router = express.Router();
const Users = require('./models/users');
const Projects = require('./models/projects');

// Users
router.post('/getAllUserData', async (req, res) => {
  try {
    const data = await new Users().getData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/getUser', async (req, res) => {
  try {
    const { login, password } = req.body; 
    const data = await new Users().getUser(login, password);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/getUserByLogin', async (req, res) => {
  try {
    const { login } = req.body; 
    const data = await new Users().getUserByLogin(login);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/getUserByLoginWithoutPassword', async (req, res) => {
  try {
    const { login } = req.body; 
    const data = await new Users().getUserByLoginWithoutPassword(login);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/getUserById', async (req, res) => {
  try {
    let { id } = req.body; 

    const data = await new Users().getUserById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/createUser', async (req, res) => {
  try {
    const { login, password } = req.body;
    const result = await new Users().createUser(login, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/deleteUser', async (req, res) => {
  try {
    const { login } = req.query;
    const result = await new Users().deleteUser(login);
    res.status(204).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/updateUser', async (req, res) => {
  try {
    const { id, newUser } = req.body;
    const result = await new Users().updateUser(id, newUser);
    res.status(204).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Projects
router.post('/getAllProjects', async (req, res) => {
  try {
    const data = await new Projects().getAllProjectData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/getProject', async (req, res) => {
  try {
    const { id } = req.body;
    const data = await new Projects().getProject(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/createProject', async (req, res) => {
  try {
    const { projectName, creatorId } = req.body;
    const result = await new Projects().createProject(projectName, creatorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/deleteProject', async (req, res) => {
  try {
    const { id } = req.query;
    const result = await new Projects().deleteProject(id);
    res.status(204).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/updateProject', async (req, res) => {
  try {
    const { id, newProject } = req.body;
    const result = await new Projects().updateProject(id, newProject);
    res.status(204).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
