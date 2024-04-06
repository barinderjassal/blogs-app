# Steps to setup and start Mongodb server

## Steps

1. Run Mongodemon in background using in one terminal window `mongod --dbpath ./mongodb-data`
2. In another terminal window, run mongo shell by typing `mongo` and run `show databases`
3. Create/Switch to a db using `use <your_db_name>`
4. To list collections created in this db, use `show collections`
5. Now query the data using
   - `db.collectionName.find()`
   - `db.collectionName.find().pretty()`, to view in a nice format
   - `db.collectionName.find({ name: 'learn-react' }).pretty()`, to view a specific object in the collection, example: `db.articles.find({ name: 'learn-react' }).pretty()`
   - `db.collectionName.update({name : 'learn-react'}, {$set: {name: 'learn-reactJS'}})`
   - `db.articles.update({}, { $unset: { comments: 1 }}, { multi: true })` Example to delete comments property/attribute of objects in articles collection. Multi `true` indicates to do this job for all objects.
6. Reference: https://www.freecodecamp.org/news/learn-mongodb-a4ce205e7739/
