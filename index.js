const express = require("express");

const app = express();
const bodyParser = require("body-parser");

const normalizePort = require("./normalizeport");

const PORT = normalizePort(process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('public'));

let dbObj = require('./db');

dbObj.setupDB();
// const router = require('./router');

// app.use("/notes/", router);

app.get('/', (req, res) => {
  console.log("Received a GET request");
  res.json({message: "Hello there"});
});

app.get('/notes', (req, res) => {
  console.log("Received a GET /notes request");
    // Connect to DB and get all notes, send them back as JSON

  let results = new Promise( (resolve, reject) => {
    resolve(await dbObj.getAllNotes());
  });
  // dbObj.getAllNotes();
  console.log("results = getAllNotes() from index.js:");
  console.log(results);
  if(results) {
    // turn the results to a JSON and send them in response to client
    res.json(results);
  }
  else {
    res.json({ message: "Empty dataset"});
  }
});

app.post('/notes', (req, res) => {
  let note_id = Date.now();
  let note_title = req.body.note_id;
  let note_body = req.body.note_body;

  dbObj.insertNote(note_id, note_title, note_body);
  let results = dbObj.getAllNotes();
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
  const id = req.params.note_id;
  const note_title = req.params.note_title;
  const note_body  = req.params.note_body; 
  dbObj.updateNote(id, note_title, note_body);
  res.json(dbObj.getAllNotes());
});

app.delete('/notes/:note_id', (req, res) => {
  // Find note in DB by id and delete it
  // Send back an OK/Fail message
  const id = req.params.note_id;
  dbObj.deleteNote(id);
  let results = dbObj.getAllNotes();
  
  res.json(results);
});


app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is listening on port ${PORT}...`);
});