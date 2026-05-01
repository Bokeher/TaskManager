const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { connectDB } = require('../db');

class Users {
  sanitizeUser(user) {
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async getUserByLogin(login) {
    try {
      const db = await connectDB();
      const coll = db.collection("Users");

      const result = await coll.findOne({ login });

      return this.sanitizeUser(result);
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

      if (passwordMatch) return this.sanitizeUser(user);

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

      return this.sanitizeUser(result);
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

      if (!result) return null

      return this.sanitizeUser(newUser);
    } catch (e) {
      console.error(e);
    }
  }

  async deleteUser(login) {
    try {
      const db = await connectDB();
      const coll = db.collection("Users");

      const result = await coll.deleteOne({ login });

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

      if (!result) return null

      return this.sanitizeUser(result.value);

    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Users;