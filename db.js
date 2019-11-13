let sqlite3 = require('sqlite3').verbose();
const dbname = "Notes.db";

let db = null;
let theDB = null;

const prepareDB = (dbname) => {
  return new sqlite3.Database(`./DB/${dbname}`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);  
} 

theDB = prepareDB(dbname);
theDB.serialize(() => {
  let sql = `CREATE TABLE IF NOT EXISTS notes (
    note_id INTEGER PRIMARY KEY, 
    note_title TEXT, 
    note_body TEXT) WITHOUT ROWID;`;
      
  theDB.run(sql, [], (err) => {
    if (err) {
      throw "Error creating table notes";
      // console.log(err.message);        
    }      
  });

  // Create and then insert into the language table the text translations for the interface 
  theDB.run("CREATE TABLE IF NOT EXISTS language (lang_id TEXT PRIMARY KEY, interface TEXT) WITHOUT ROWID;", [], (err) => {
    if (err) {
      throw "Error creating table language";
      // console.log(err.message);
    }
  });  
});

const setupDB = () => {
  return new Promise((resolve, reject) => {
    if(db) {
      // the db is already created and connected
      resolve(db);
    }

    db = new sqlite3.Database('./DB/' + dbname, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if(err) {
          console.log(err.message);
          reject("There was an error creating db");
      }
      else {        
        try {
          createTables();
          console.log(`Connected to ./DB/${dbname} database`);
          resolve(db);
        }
        catch(err) 
        { 
          reject(err);
        }                
      }      
    });
  });
}
    // const dbname = "Notes.db"
    
const createTables = () => {
  
  db.serialize( () => {
      
    let sql = `CREATE TABLE IF NOT EXISTS notes (
                note_id INTEGER PRIMARY KEY, 
                note_title TEXT, 
                note_body TEXT) WITHOUT ROWID;`;
                  
    db.run(sql, [], (err) => {
      if (err) {
        throw "Error creating table notes";
        // console.log(err.message);        
      }      
    });
      
    // Create and then insert into the language table the text translations for the interface 
    db.run("CREATE TABLE IF NOT EXISTS language (lang_id TEXT PRIMARY KEY, interface TEXT) WITHOUT ROWID;", [], (err) => {
      if (err) {
        throw "Error creating table language";
        // console.log(err.message);
      }
    });        
  });    
}
  

const getAllNotes = () => { 
  return new Promise( (resolve, reject) => {
   // const dbname = "Notes.db";  
    setupDB().then( db => {
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
  });        
}

const find = (id) => {
  return new Promise((resolve, reject) => {
    let resultSet;

    setupDB().then(db => {
      db.get('SELECT * FROM notes WHERE note_id = ' + id, (err, result) => {
        if (err) {
          console.log(err.message);
          reject(err.message);
        }
        else {
          resolve(result);
        }
      });  
    });      
  })  
}

const insertNote = (id, title, body) => {
  setupDB()
    .then(db => {
      return new Promise((resolve, reject) => {
    // const dbname = "Notes.db";        
        let sql = 'INSERT INTO notes (note_id, note_title, note_body) VALUES(?, ?, ?)'; 
        db.run(sql, [id, title, body], (err) => {
          if(err) {
            // db.close();
            reject(err);
          }
          else {
            resolve("Insertion successful");
          }
        });             
      });  
  })
  .catch(err => {
    reject(err.message);
  })   
}

const updateNote = (id, title, body) => {
  return new Promise((resolve, reject) => {
    db = setupDB();
    db.then((val) => {
      let sql = db.prepare(`UPDATE notes SET note_title = ?, note_body = ? WHERE note_id = ?`);
      sql.run(sql, [title, body, id], (err => {
        if (err) {
          reject(err.message);
        }
        else {
          resolve("Note is updated successful");
        }
      }))
    })
    .catch(err => {
      console.log(err.message);
    }) 
  })
}        

const deleteNote = (noteid) => {
  setupDB()
    .then(db => {
      return new Promise((resolve, reject) => {   
  
        let sql = `DELETE FROM notes WHERE note_id = ${noteid};`;
        db.run(sql, [], (err) => {
          if(err) {
            reject(err.message);
          }
          else {
            resolve("Note deleted successfully");
          }
        });    
      }); 
    });  
}

const closeDB = () => {
  return new Promise((resolve, reject) => {
    db.close(err => {
      if(err) {
        reject(err.message);
      }
      else {
        resolve("DB closed successfully");
      }
    });
  });
}

const restartDB = () => {  
  db.close()
    .then(() => {
      setupDB();
  })   
}

const localize = (lang_id) => {
  // Get the localization JSON object from the language table by the lang_id
}


let dbObj = { 
  theDB,
  setupDB, 
  getAllNotes,
  deleteNote,
  find, 
  insertNote, 
  updateNote,
  restartDB
};

module.exports = dbObj;