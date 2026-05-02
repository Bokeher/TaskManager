const express = require('express');
const router = express.Router();
const Users = require('./models/users');
const Projects = require('./models/projects');
const { authenticateToken, generateToken, requireProjectMember } = require('./auth');

// Users
router.post('/getAllUserData', authenticateToken, async (req, res) => {
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

router.post('/getUserByLogin', authenticateToken, async (req, res) => {
  try {
    const { login } = req.body; 
    const data = await new Users().getUserByLogin(login);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/getUserByLoginWithoutPassword', authenticateToken, async (req, res) => {
  try {
    const { login } = req.body; 
    const data = await new Users().getUserByLoginWithoutPassword(login);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/getUserById', authenticateToken, async (req, res) => {
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
    const { login, password, email } = req.body;
    const result = await new Users().createUser(login, password, email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/deleteUser', authenticateToken, async (req, res) => {
  try {
    const { login } = req.query;
    const result = await new Users().deleteUser(login);
    res.status(204).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/updateUser', authenticateToken, async (req, res) => {
  try {
    const { id, newUser } = req.body;
    const result = await new Users().updateUser(id, newUser);
    res.status(204).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Projects
router.post('/getAllProjects', authenticateToken, async (req, res) => {
  try {
    const data = await new Projects().getAllProjectData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/getProject', authenticateToken, requireProjectMember, async (req, res) => {
  try {
    // project is attached by auth middleware
    const data = req.project;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/createProject', authenticateToken, async (req, res) => {
  try {
    const { projectName, creatorId } = req.body;

    if (req.user._id.toString() !== creatorId) {
      return res.status(403).json({ error: 'You can only create projects for yourself.' });
    }

    const result = await new Projects().createProject(projectName, creatorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/deleteProject', authenticateToken, requireProjectMember, async (req, res) => {
  try {
    const { id } = req.query;
    const result = await new Projects().deleteProject(id);
    res.status(204).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/updateProject', authenticateToken, requireProjectMember, async (req, res) => {
  try {
    const { id, newProject } = req.body;
    const result = await new Projects().updateProject(id, newProject);
    res.status(204).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
