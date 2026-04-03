const { ObjectId } = require('mongodb');
const { connectDB } = require('../db');

class Projects {

  async getProject(projectId) {
    try {
      const db = await connectDB();
      const coll = db.collection("Projects");

      const result = await coll.findOne({ _id: new ObjectId(projectId) });

      console.log(`getProject(${projectId})`);
      console.log(result);

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

      console.log(`createProject(${projectName}, ${creatorId})`);
      console.log(result);

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

      console.log(`deleteProject(${id})`);
      console.log(result);

      return result;
    } catch (e) {
      console.error(e);
    }
  }

  async updateProject(id, newProject) {
    try {
      const db = await connectDB();
      const coll = db.collection("Projects");

      const result = await coll.findOneAndReplace(
        { _id: new ObjectId(id) },
        newProject
      );

      console.log(`updateProject(${id})`);
      console.log(result);

      return result;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Projects;