const { ObjectId } = require('mongodb');
const { connectDB } = require('../db');

class Projects {

  async getProject(projectId) {
    try {
      const db = await connectDB();
      const coll = db.collection("Projects");

      const result = await coll.findOne({ _id: new ObjectId(projectId) });

      return result;
    } catch (e) {
      console.error(e);
    }
  }

  async createProject(projectName, creatorId) {
    try {
      const db = await connectDB();
      const coll = db.collection("Projects");

      const newProject = {
        _id: new ObjectId(),
        name: projectName,
        projectMembers: [
          {
            userId: creatorId,
            isAdmin: true
          }
        ],
        tasks: [],
        categories: []
      };

      const result = await coll.insertOne(newProject);

      return result;
    } catch (e) {
      console.error(e);
    }
  }

  async deleteProject(id) {
    try {
      const db = await connectDB();
      const coll = db.collection("Projects");

      const result = await coll.deleteOne({ _id: new ObjectId(id) });

      return result;
    } catch (e) {
      console.error(e);
    }
  }

  async updateProject(id, newProject) {
    try {
      const db = await connectDB();
      const coll = db.collection("Projects");

      const result = await coll.updateOne(
        { _id: new ObjectId(id) },
        { $set: newProject }
      );

      return result;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Projects;