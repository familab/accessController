from __future__ import print_function
import sqlite3, os
from contextlib import closing

SCHEMA = os.path.dirname(__file__) + "/schema.sql"

def init_db(database):
  if os.path.isfile(database):
    return
  print ("Loading Schema %s", SCHEMA)
  with closing(connect_db(database)) as db:
    with open(SCHEMA,'r') as f:
      db.cursor().executescript(f.read())
    db.commit()

def connect_db(database):
  return sqlite3.connect(database)
  
def close(database):
  if database is not None:
    database.close()