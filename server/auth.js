const jwt = require('jsonwebtoken');
const Users = require('./models/users');
const Projects = require('./models/projects');

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user) {
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      login: user.login,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

async function authenticateToken(req, res, next) {
  try {
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT configuration is missing.' });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token is required.' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, jwtSecret);

    const currentUser = await new Users().getUserById(payload.sub);

    if (!currentUser) {
      return res.status(401).json({ error: 'User for this token no longer exists.' });
    }

    req.user = currentUser;
    req.token = token;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authorization token.' });
  }
}

async function requireProjectMember(req, res, next) {
  try {
    const projectId = req.body.id || req.query.id;

    if (!projectId) {
      return res.status(400).json({ error: 'Project id is required.' });
    }

    const project = await new Projects().getProject(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const isMember = project.projectMembers.some(
      (member) => member.userId === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ error: 'You do not have access to this project.' });
    }

    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  authenticateToken,
  generateToken,
  requireProjectMember,
};
