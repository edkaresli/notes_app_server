const express = require("express");

const app = express();
const bodyParser = require("body-parser");

const normalizePort = require("./normalizeport");

const PORT = normalizePort(process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('public'));

let dbObj = require('./db');
let theDB = dbObj.theDB;
// dbObj.setupDB();

// const router = require('./router');

// app.use("/notes/", router);

app.get('/', (req, res) => {
  console.log("Received a GET request");
  res.json({message: "Hello there"});
});

app.get('/notes', (req, res) => {
  console.log("Received a GET /notes request");
  theDB.all("SELECT * FROM notes", (err, results) => {
    if (err) {
      res.send(err.message);
    }
    console.log(results);
    res.json(results);
  })
  /*
    // Connect to DB and get all notes, send them back as JSON
  let results = dbObj.getAllNotes();
  results.then(data => {
    console.log(data);
    res.json(data);
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  });
    */
});

app.post('/notes', (req, res) => {
  console.log("Received a POST /notes request.");
  
  let note_id = Date.now();
  let note_title = req.body.note_title;
  let note_body = req.body.note_body;
  
  console.log(`Data: { note_id: ${note_id}, note_title: ${note_title}, note_body: ${note_body} }`);
  
  
  theDB.run('INSERT INTO notes (note_id, note_title, note_body) VALUES(?, ?, ?)', [note_id, note_title, note_body], (err => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
    }
    else {
      theDB.all('SELECT * FROM notes', [], (err, results) => {
        if (err) {
          console.log(err.message);
          res.send(err.message);            
        }
        else {
          res.json(results);
        }
      })
    }
  }))  
   
  // TODO:
  app.get('/notes/:note_id', (req, res) => {
    const note_id = req.params.note_id;
    let sql = 'SELECT note_title, note_body FROM notes WHERE note_id = ?';
    theDB.run(sql, [note_id], (err => {
      if (err) {
        console.log(err.message);
        res.send(err.message);
      }
      else {
        theDB.all(sql, [note_id], (err, results) => {
          if(err) {
            console.log(err.message);
            res.send(err.message);          
          }
          else {
            res.json(results);
          }
        })
      }
    }))
  });

  /*
  let prom = dbObj.insertNote(note_id, note_title, note_body);
  prom.then( () => {
    let results = dbObj.getAllNotes();
    results.then(data => {
    res.json(data);
  })
    .catch(err => {
      res.send(err);
    });
  })
    .catch(err => {
      res.send(err);
    });
    */
  // Extract note from req and insert it as a row into DB
  // Send back and OK/Fail message
});

app.put('/notes/:note_id', (req, res) => {
  // Extract note from req and update DB with it using its ID and body
  // Send back an OK/Fail message
  console.log("Receiving a PUT /notes/:note_id request");

  const note_id = req.params.note_id;
  const note_title = req.body.note_title;
  const note_body  = req.body.note_body; 

  console.log(`Data: { note_id: ${note_id}, note_title: ${note_title}, note_body: ${note_body} }`);
  
  let sql = 'UPDATE notes SET note_title = ?, note_body = ? WHERE note_id = ?';
  theDB.run(sql, [note_title, note_body, note_id], (err => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
    }
    else {
      theDB.all('SELECT * FROM notes', [], (err, results) => {
        if(err) {
          console.log(err.message);
          res.send(err.message);          
        }
        else {
          res.json(results);
        }
      })
    }
  }))
/*
  dbObj.updateNote(note_id, note_title, note_body)
  .then(val => {
    console.log(val);
    let results = dbObj.getAllNotes();
    results.then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send(err);
    }); 
  })
    .catch(err => {
      res.send(err);
    })    
    */
});

app.delete('/notes/:note_id', (req, res) => {
  // Find note in DB by id and delete it
  // Send back an OK/Fail message
  console.log("Received a DELETE /notes/:note_id request");
  const id = req.params.note_id;
  let sql = 'DELETE FROM notes WHERE note_id = ?';
  theDB.run(sql, [id], (err) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
    }
    else {
      theDB.all('SELECT * FROM notes', [], (err, results) => {
        if (err) {
          console.log(err.message);
          res.send(err.message);
        }
        else {
          res.json(results);
        }
      })
    }
  })
  /*
  dbObj.deleteNote(id)
  .then((val) => {
    console.log(val);
    let results = dbObj.getAllNotes();
    results.then(data => {
      res.json(data);
    })
      .catch(err => {
        res.send(err);
      })    
  })
    .catch(err => {
      res.send(err);
    });  
    */
});


app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is listening on port ${PORT}...`);
});

