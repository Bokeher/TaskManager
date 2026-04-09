const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { connectDB } = require('../db');

class Users {

  async getUserByLogin(login) {
    try {
      const db = await connectDB();
      const coll = db.collection("Users");

      const result = await coll.findOne({ login });

      const { password, ...safeUser } = result

      console.log(`getUserByLogin(${login})`);
      console.log(safeUser);

      return safeUser;
    } catch (e) {
      console.error(e);
    }
  }

  async getUser(login, password) {
    try {
      const db = await connectDB();
      const coll = db.collection("Users");

      const user = await coll.findOne({ login });

      if (!user) return null;

      const passwordMatch = await bcrypt.compare(password, user.password);

      console.log(`getUser(${login})`);

      if (passwordMatch) {
        console.log("Password match");

        const { password, ...safeUser } = user
        console.log(safeUser);

        return safeUser;
      }

      console.log("Password doesn't match");
      return null;

    } catch (e) {
      console.error(e);
    }
  }

  async getUserById(id) {
    try {
      const db = await connectDB();
      const coll = db.collection("Users");

      const result = await coll.findOne({ _id: new ObjectId(id) });

      const { password, ...safeUser } = result
      
      console.log(`getUserById(${id})`);
      console.log(safeUser);

      return safeUser;
    } catch (e) {
      console.error(e);
    }
  }

  async createUser(login, password, email) {
    try {
      const db = await connectDB();
      const coll = db.collection("Users");

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await coll.findOne({ login });

      if (existingUser) {
        console.log('User already exists.');
        return null;
      }

      const newUser = {
        avatarUrl: "",
        login,
        password: hashedPassword,
        projectIds: [],
        email
      };

      const result = await coll.insertOne(newUser);

      const { password: _, ...safeUser } = newUser

      console.log(`createUser(${login})`);
      console.log(safeUser);

      return safeUser;
    } catch (e) {
      console.error(e);
    }
  }

  async deleteUser(login) {
    try {
      const db = await connectDB();
      const coll = db.collection("Users");

      const result = await coll.deleteOne({ login });

      console.log(`deleteUser(${login})`);
      console.log(result);

      return result;

    } catch (e) {
      console.error(e);
    }
  }

  async updateUser(id, newUser) {
    try {
      const db = await connectDB();
      const coll = db.collection("Users");

      const result = await coll.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: newUser },
        { returnDocument: 'after' }
      );

      const { password, ...safeUser} = result.value

      console.log(`updateUser(${id})`);
      console.log(safeUser);

      return safeUser;

    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Users;