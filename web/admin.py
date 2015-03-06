from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
import sqlite3, os, database.db

HOST = os.getenv('IP', '0.0.0.0')
PORT = int(os.getenv('PORT', 8080))

app = Flask(__name__)

# Database  
def connect_db():
  """Connects to the specific database."""
  database.db.init_db(app.config['DATABASE'])
  return sqlite3.connect(app.config['DATABASE'])
  
def get_db():
  """Opens a new database connection if there is none yet for the
  current application context.
  """
  if not hasattr(g, 'sqlite_db'):
    g.sqlite_db = connect_db()
  return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
  """Closes the database again at the end of the request."""
  if hasattr(g, 'sqlite_db'):
    g.sqlite_db.close()
    
# Routes
@app.route('/')
def hello():
  return 'Hello World'
    
# Startup
def run(config):
  """ Configures and starts the admin web interface """
  app.config.from_object(config)
  app.run(host=app.config['HOST'],port=app.config['PORT'])