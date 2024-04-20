const { MongoClient, ObjectId } = require('mongodb');

class Users {
  uri = process.env.MONGODB_URI;

  // users
  async getAllUserData() {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");

      result = await coll.find({}).toArray();
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async getUserByLogin(login) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");

      result = await coll.findOne({"login": login});
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async getUserByLoginWithoutPassword(login) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");

      result = await coll.findOne({"login": login});
      result.password = "";
      result.projectIds = null;
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async getUser(login, password) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");

      result = await coll.findOne({"login": login, "password": password});
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async getUserById(id) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");

      result = await coll.findOne({"_id": new ObjectId(id)});
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async createUser(login, password) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");
      
      const existingUser = await coll.findOne({"login": login});
      if (existingUser) {
        console.log('User already exists.');
        return null;
      }

      const newUser = {
        "avatarUrl": "",
        "login": login,
        "password": password,
        "projectIds": []
      };

      result = await coll.insertOne(newUser);
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async deleteUser(login) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");

      result = await coll.deleteOne({"login": login});
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }

  async updateUser(id, newUser) {
    let result;
    const client = new MongoClient(this.uri);

    try {  
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");
      
      const filter = { "_id": new ObjectId(id) };

      result = await coll.findOneAndReplace(filter, newUser);
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      return result;
    }
  }
}

module.exports = Users;
