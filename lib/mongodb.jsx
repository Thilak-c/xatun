// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:27017/xatun";
const options = {};

let client;
let clientPromise;

if (!"mongodb://localhost:27017/xatun") {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;