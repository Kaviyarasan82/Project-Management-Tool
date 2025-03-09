const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Mongoose connected'))
  .catch(err => console.error('Mongoose error:', err));

const client = new MongoClient(uri);
client.connect()
  .then(() => {
    console.log('MongoClient connected');
    return client.db("admin").command({ ping: 1 });
  })
  .then(() => console.log('Ping successful'))
  .catch(err => console.error('MongoClient error:', err))
  .finally(() => client.close());