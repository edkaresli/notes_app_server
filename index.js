const express = require("express");

const app = express();
const bodyParser = require("body-parser");

const normalizePort = require("./normalizeport");

const PORT = normalizePort(process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('public'));

let dbObj = require('./db');

dbObj.setupDB("NotesDB");
// const router = require('./router');

// app.use("/notes/", router);

app.get('/notes', (req, res) => {
    // Connect to DB and get all notes, send them back as JSON
  let results = dbObj.getAllNotes("NotesDB");
  if(results) {
    // turn the results to a JSON and send them in response to client
    res.json(results);
  }
});

app.post('/notes', (req, res) => {
  let id = req.body.note_id;
  let note_title = req.body.note_id;
  let note_body = req.body.note_body;

  dbObj.insertNote("NotesDB", id, note_title, note_body);
  let results = dbObj.getAllNotes("NotesDB");
  if(results) {
    res.json(results);
  }
  else {
    res.json({message: "A problem occured"});
  }
  
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