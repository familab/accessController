var debug = require('debug')('FamiLAB:Database');
var sqlite3 = require('sqlite3').verbose();

var db = {
  config: null,
  database: null,
  start: function() {
    var database = this.database = new sqlite3.Database(this.config.db);
    var logDatabase = this.logDatabase = new sqlite3.Database(this.config.logDb);

    // Build DB
    // TODO migrations https://github.com/rsandor/node-migrate
    database.serialize(function() {
      database.run('CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY, name TEXT NOT NULL, username TEXT UNIQUE, password TEXT)');
      database.run('CREATE TABLE IF NOT EXISTS Card (id INTEGER PRIMARY KEY, userId INTEGER NOT NULL, uid TEXT UNIQUE NOT NULL)');
      //database.run('CREATE TABLE IF NOT EXISTS Log.Entry (uid TEXT NOT NULL, readerId INTERGER NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');
      //database.run('CREATE TABLE IF NOT EXISTS Log.Failure (uid TEXT NOT NULL, readerId INTERGER NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');

      var insertUserStmt = database.prepare('INSERT INTO User (name) VALUES (?)');
      var users = ['Lance Hudson'];
      users.forEach(function(user) {
        insertUserStmt.run(user);
      });
      insertUserStmt.finalize();

      var selectUserStmt = database.prepare('SELECT id FROM User WHERE name LIKE (?)');
      var insertCardStmt = database.prepare('INSERT INTO Card (userId, uid) VALUES (?, ?)');
      var cards = [{name: 'Lance Hudson', uid: '567d890d'}];
      cards.forEach(function(card) {
        selectUserStmt.each(card.name, function(err, row) {
          debug(row, card.uid);
          insertCardStmt.run([row.id, card.uid]);
        });
      });
      selectUserStmt.finalize();
    });
  },
  close: function() {
    this.database.close();
    this.logDatabase.close();
  },
  canUserEnter: function(readerId, uid, cb) {
    var database = this.database;
    debug(uid);
    database.get('SELECT User.id, User.name, Card.uid FROM Card JOIN User ON User.id = Card.userId WHERE Card.uid LIKE (?)', [uid], function (err, row) {
      debug(row);
      if (row === undefined) return cb(null, false);
      return cb(null, true);
    });
  }
};

module.exports = function(config) {
  db.config = config;
  return db;
};
