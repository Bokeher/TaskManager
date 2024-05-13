const { MongoClient, ObjectId } = require('mongodb');

class Projects {
  uri = process.env.MONGODB_URI;

  async getProject(projectId) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Projects");

      const objectId = new ObjectId(projectId);

      result = await coll.findOne({"_id": objectId});
      console.log(`\ngetProject(${projectId})`);
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async createProject(projectName, creatorId) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Projects");

      const newProjectObjectId = new ObjectId();

      const newProject = {
        "_id": newProjectObjectId,
        "name": projectName,
        "projectMembers": [
          {
            "userId": creatorId,
            "isAdmin": true
          }
        ],
        "tasks": [],
        "categories": []
      }

      result = await coll.insertOne(newProject);
      console.log(`\ncreateProject(${projectName}, ${creatorId})`);
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async deleteProject(id) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Projects");

      const objectId = new ObjectId(id);

      result = await coll.deleteOne({"_id": objectId});
      console.log(`\ndeleteProject(${id})`);
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async updateProject(id, newProject) {
    let result;
    const client = new MongoClient(this.uri);

    try {  
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Projects");

      const filter = { _id: new ObjectId(id) };

      result = await coll.findOneAndReplace(filter, newProject);
      console.log(`\nupdateProject(${id}, ${newProject})`);
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }
}

module.exports = Projects;