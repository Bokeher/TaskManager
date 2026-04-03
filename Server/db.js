require('dotenv').config();
const { MongoClient} = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('TaskManager');
        console.log('Connected to MongoDB');
    }

    return db;
}

module.exports = { connectDB };