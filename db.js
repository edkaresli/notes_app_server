let sqlite3 = require('sqlite3').verbose();
const dbname = "Notes.db";

const setupDB = () => {
    // const dbname = "Notes.db"
    let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if(err) {
          console.log(err.message);
          return;
      }

      console.log(`Connected to ./DB/${dbname} database`);
  });

  db.serialize( () => {
    
    let sql = `CREATE TABLE IF NOT EXISTS notes (
                 note_id INTEGER PRIMARY KEY, 
                 note_title TEXT, 
                 note_body TEXT) WITHOUT ROWID;`;
                 
    db.run(sql, [], (err) => {
      if (err) {
        console.log(err.message);
      }
    });
    
    // Create and then insert into the language table the text translations for the interface 
    db.run("CREATE TABLE IF NOT EXISTS language (lang_id TEXT PRIMARY KEY, interface TEXT) WITHOUT ROWID;", [], (err) => {
      if (err) {
        console.log(err.message);
      }
    });
    
  });

  db.close();
}

const getAllNotes = () => { 
  return new Promise( (resolve, reject) => {
   // const dbname = "Notes.db";  

    let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READ, (err) => {
      if (err) {
        reject(err.message);
      }
    });
    
    let sql = 'SELECT * from notes;';
    
    db.all(sql, [], (err, result) => {
      if(result) {
        resolve(result);
      }
      else {
        reject(err.message);
      }  
    }); 
  }); 
}

const find = (id) => {
 // const dbname = "Notes.gb"
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

const insertNote = (id, title, body) => {
  return new Promise((resolve, reject) => {
    // const dbname = "Notes.db";
      let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          reject(err);
        }
      });

      db.run('INSERT INTO notes (note_id, note_title, note_body) VALUES(?, ?, ?)', [id, title, body], (err) => {
        if(err) {
          reject(err);
        }
      });

      db.close();

      resolve("Insertion successful");
  });  
}

const updateNote = (id, title, body) => {
  return new Promise((resolve, reject) => {
   // const dbname = "Notes.db";
    let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err.message);
      }    
    });
    console.log(`Inside dbObj.updateNote()
       note_id: ${id}, note_title: ${title}, note_body: ${body}
    `);
    let sql = `UPDATE notes SET note_title = ${title}, note_body = ${body} WHERE note_id = ${id};`;
    db.run(sql, [], (err) => {
      if (err) {
        reject(err.message);
      }
    });
    db.close();
    
    resolve("Note updated successfully");
  });  
}

const deleteNote = (noteid) => {
 // const dbname = "Notes.db";
 return new Promise((resolve, reject) => {
   let db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      reject(err.message);
    }
  });
  
  let sql = `DELETE FROM notes where note_id = ${noteid};`;
  db.run(sql, [], (err) => {
    if(err) {
      reject(err.message);
    }
  });

  resolve("Note deleted successfully");
 });  
}

const localize = (lang_id) => {
  // Get the localization JSON object from the language table by the lang_id
}


let dbObj = {
  setupDB, 
  getAllNotes,
  deleteNote,
  find, 
  insertNote, 
  updateNote
};

module.exports = dbObj;