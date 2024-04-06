import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import "dotenv/config";
import { db, createMongoClientAndConnect } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
  fs.readFileSync("service-account-credentials.json")
);

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(cors());

/**
 * it is a middleware
 * Whenever any request that has a JSON payload, it will parse and make it available on req.body
 */
app.use(express.json());

app.use(express.static(path.join(__dirname, "../dist")));

// regex to check API paths that dont start with 'api'
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

/**
 * middleware to validate token
 */
app.use(async (req, res, next) => {
  const { token } = req.headers;
  if (token) {
    try {
      req.user = await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }
  console.log("req.user in first middleware", req.user);
  console.log("token", token);
  req.user = req.user || {}; // default value of req.user in the middleware

  next();
});

/**
 * Get Particular article
 */
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name }); // { name: name }

  // res.setHeader("Access-Control-Allow-Origin", "*");
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    // if the current uid is not in the upvoteIds array, only then user can upvote the article
    const canUpvote = uid && !upvoteIds.includes(uid);
    res.json({ ...article, canUpvote });
  } else {
    res.sendStatus(404);
  }
});

// middleware to check next endpoints
app.use((req, res, next) => {
  console.log("req.user in middleware", req.user);
  if (req.user) {
    // token is valid: user is authenticated
    next();
  } else {
    // Unauthorized access: not allowed to upvote or comment
    res.sendStatus(401);
  }
});

/**
 * Upvote endpoint
 */
app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user; // get the uid of the loged-in user

  const article = await db.collection("articles").findOne({ name }); // { name: name }
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid); // if loged-in user has not updated this article yet

    if (canUpvote) {
      await db.collection("articles").updateOne(
        { name },
        {
          $inc: { upvotes: 1 }, // $inc is one of the Mongodb OPerators
          $push: { upvoteIds: uid },
        }
      );
      const updatedArticle = await db.collection("articles").findOne({ name });
      res.json({ ...updatedArticle, canUpvote });
    }
  } else res.send(`That article doesn't exist`);
});

/**
 * Post Comments endpoint
 */
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;

  await db.collection("articles").updateOne(
    { name },
    {
      $push: {
        comments: { postedBy: email, text, id: Math.ceil(Math.random() * 100) },
      },
    }
  );

  const article = await db.collection("articles").findOne({ name });

  if (article) res.json(article);
  else res.send(`That article doesn't exist`);
});

/**
 * Delete a comment
 */
app.delete("/api/articles/:name/comments/:commentid", async (req, res) => {
  const { name, commentid } = req.params;

  console.log("req.user", req.user);

  await db.collection("articles").updateOne(
    { name },
    {
      $pull: {
        comments: { commentid },
      },
    }
  );

  const article = await db.collection("articles").findOne({ name });

  if (article) res.json(article);
  else res.send(`That article doesn't exist`);
});

// get PORT number from Hosting Platform
const PORT = process.env.PORT || 8080;

// Connect the db and listen the server
createMongoClientAndConnect(() => {
  console.log("Databse connection is established...");

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
});
