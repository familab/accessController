// Path to the migrations directory (relative to migrate)
exports.migration_path = './migrations/';

// Which DBMS to use for executing migrations
exports.dbms = 'sqlite3';

// Configuration for SQLite3 (filename, verbose)
exports.sqlite3 = {
  filename: '../../.data/db.sqlite3',
  verbose: true
};
