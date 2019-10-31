let sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./DB/NotesApp.db', (err) => {
    if(err) {
        console.log(err.message);
        // return err;
    }

    console.log('Connected to notes.txt database.');
});

db.serialize( () => {
  
  db.run("CREATE TABLE notes (note_id INTEGER PRIMARY KEY, note_title TEXT, note_body TEXT)");
  
  // Create and then insert into the language table the text translations for the interface 
  db.run("CREATE TABLE language (lang_id TEXT, interface TEXT)");

  
});



module.exports = db;