const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class Users {
  uri = process.env.MONGODB_URI;

  async getUserByLogin(login) {
    let result;
    const client = new MongoClient(this.uri);
 
    try {
      await client.connect();

      const db = client.db("TaskManager");
      const coll = db.collection("Users");

      result = await coll.findOne({"login": login});
      console.log(`\ngetUserByLogin(${login})`);
      console.log(result);
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

      const user = await coll.findOne({ "login": login });

      if (!user) return null;

      const passwordMatch = await bcrypt.compare(password, user.password);

      console.log(`\ngetUser(${login}, ${password})`);
      console.log(result);
      if (passwordMatch) {
        console.log("Password match"); 
        return user;
      } 
      
      console.log("Password doesn't match"); 
      return null;
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
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
      console.log(`\ngetUserById(${id}`);
      console.log(result);
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

    const hashedPassword = await bcrypt.hash(password, 10);
 
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
        "password": hashedPassword,
        "projectIds": []
      };

      result = await coll.insertOne(newUser);
      console.log(`\ncreateUser(${login}, ${password})`);
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
      console.log(`\ndeleteUser(${login})`);
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
      console.log(`\nupdateUser(${id}, ${newUser})`);
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
