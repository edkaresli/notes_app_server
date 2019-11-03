let sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./DB/NotesApp.db', sqlite3.OPEN_READWRITE, (err) => {
    if(err) {
        console.log(err.message);
        // return err;
    }

    console.log('Connected to ./DB/NotesApp.db database.');
});

db.serialize( () => {
  
  db.run("CREATE TABLE [IF NOT EXISTS] notes (note_id INTEGER PRIMARY KEY, note_title TEXT, note_body TEXT)");
  
  // Create and then insert into the language table the text translations for the interface 
  db.run("CREATE TABLE [IF NOT EXISTS] language (lang_id TEXT, interface TEXT)");
  
});

const find = (id) => {
  db.run('SELECT * FROM notes WHERE note_id = ' + id, (err, result) => {
    console.log(result);
  });
}

const insertNote = (id, title, body) => {
  db.run('INSERT INTO notes (?, ?, ?)', id, title, body);
}

const update = (id, title, body) => {
   
}

const localize = (lang_id) => {
  // Get the localization JSON object from the language table by the lang_id
}

module.exports = db;