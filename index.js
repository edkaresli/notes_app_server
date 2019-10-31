const express = require("express");

const app = express();
const bodyParser = require("body-parser");

const normalizePort = require("./normalizeport");

const PORT = normalizePort(process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('public'));

let db = require('./db');

// const router = require('./router');

// app.use("/notes/", router);

app.get('/notes', (req, res) => {
    // Connect to DB and get all notes, send them back as JSON
});

app.post('/notes', (req, res) => {
  // Extract note from req and insert it as a row into DB
  // Send back and OK/Fail message
});

app.put('/notes/:id', (req, res) => {
  // Extract note from req and update DB with it using its ID and body
  // Send back an OK/Fail message
});

app.delete('/notes/:id', (req, res) => {
  // Find note in DB by id and delete it
  // Send back an OK/Fail message
});


app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is listening on port ${PORT}...`);
});