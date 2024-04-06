import { MongoClient } from "mongodb";

let db;

/**
 * Create Mongo Db client, connect it and return the specific DB
 * "mongodb://127.0.0.1:27017"
 */
const createMongoClientAndConnect = async (callback) => {
  const mongodbClient = new MongoClient(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.mh4xnax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
  await mongodbClient.connect();
  db = mongodbClient.db("react-blogs-db"); // name of the database created using mongodb shell -> use react-blogs-db
  callback();
};

const art = [
  {
    name: "learn-react",
    upvotes: 0,
    comments: [],
  },
  {
    name: "learn-node",
    upvotes: 0,
    comments: [],
  },
  {
    name: "mongodb",
    upvotes: 0,
    comments: [],
  },
];

export { db, createMongoClientAndConnect };
