let sqlite3 = require('sqlite3').verbose();

const setupDB = (dbname) => {
    let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READWRITE, (err) => {
      if(err) {
          console.log(err.message);
          // return err;
      }

      console.log(`Connected to ./DB/${dbname} database`);
  });

  db.serialize( () => {
    
    db.run("CREATE TABLE [IF NOT EXISTS] notes (note_id INTEGER PRIMARY KEY, note_title TEXT, note_body TEXT)");
    
    // Create and then insert into the language table the text translations for the interface 
    db.run("CREATE TABLE [IF NOT EXISTS] language (lang_id TEXT, interface TEXT)");
    
  });

  db.close();
}

const getAllNotes = (dbname) => {
  let resultSet;

  let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  
  let sql = 'SELECT * from notes';

  db.all(sql, [], (err, result) => {
    if (err) {
      console.log(err.message);
      return null;
    }
    resultSet = result;
    return resultSet;
  });
}

const find = (dbname, id) => {
  let resultSet;

  let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.log(err.message);
    }
  });

  db.get('SELECT * FROM notes WHERE note_id = ' + id, (err, result) => {
    if (err) {
      console.log(err.message);
    }
    console.log(result);
    resultSet = result;
  });
   
  db.close();

  return resultSet;
}

const insertNote = (dbname, id, title, body) => {
  let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.log(err.message);
    }
  });

  db.run('INSERT INTO notes (?, ?, ?)', [id, title, body], (err) => {
    if(err) {
      console.log(err.message);
    }
  });

  db.close();
}

const updateNote = (dbname, id, title, body) => {
  let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  let sql = `UPDATE notes set note_title = ${title}, note_body = ${body} WHERE note_id = ${id}`;
  db.run(sql, (err) => {
    if (err) {
      console.log(err.message);
    }
  });

  db.close();
}

const localize = (lang_id) => {
  // Get the localization JSON object from the language table by the lang_id
}

module.exports = {
  setupDB, 
  getAllNotes,
  find, 
  insertNote, 
  updateNote
};